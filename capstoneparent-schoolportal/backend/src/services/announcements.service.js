const prisma = require('../config/database');
const usersService = require("./users.service");
const { deleteFileByUrl } = require("../utils/supabaseStorage");

const announcementsService = {
  async getAllAnnouncements({ page, limit, type, userRoles }) {
    // Validate pagination params
    if (!page || isNaN(parseInt(page)) || parseInt(page) < 1) {
      throw new Error('Invalid page number');
    }
    if (!limit || isNaN(parseInt(limit)) || parseInt(limit) < 1) {
      throw new Error('Invalid limit number');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (type) {
      // Must match Prisma AnnouncementType enum and route validators
      const validTypes = ['General', 'Staff_only', 'Memorandum'];
      if (!validTypes.includes(type)) {
        throw new Error(`Invalid announcement type. Must be one of: ${validTypes.join(', ')}`);
      }
      where.announcement_type = type;
    } else {
      const isStaff = userRoles.some(role =>
        ['Teacher', 'Admin', 'Principal', 'Vice_Principal', 'Librarian'].includes(role)
      );

      if (!isStaff) {
        where.announcement_type = 'General';
      }
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
              photo_path: true,
              roles: {
                select: {
                  role: true,
                },
              },
            }
          },
          files: {
            include: {
              file: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.announcement.count({ where })
    ]);

    return {
      announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  },

  async getAnnouncementById(announcementId) {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    const announcement = await prisma.announcement.findUnique({
      where: { announcement_id: announcementId },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            photo_path: true,
            roles: {
              select: {
                role: true,
              },
            },
          }
        },
        files: {
          include: {
            file: true
          }
        }
      }
    });

    if (!announcement) {
      throw new Error('Announcement not found');
    }

    return announcement;
  },

  async createAnnouncement(announcementData) {
    const { announcement_title, announcement_desc, announcement_type, announced_by, file_ids, files } = announcementData;

    // Validate required fields
    if (!announcement_title || announcement_title.trim() === '') {
      throw new Error('Announcement title is required');
    }
    if (!announcement_desc || announcement_desc.trim() === '') {
      throw new Error('Announcement description is required');
    }
    if (!announcement_type) {
      throw new Error('Announcement type is required');
    }
    if (!announced_by) {
      throw new Error('Announcer is required');
    }

    // Validate that the announcing user exists
    const announcer = await prisma.user.findUnique({
      where: { user_id: announced_by }
    });
    if (!announcer) {
      throw new Error('Announcing user not found');
    }

    const parsedFileIds = (Array.isArray(file_ids) ? file_ids : [])
      .map((id) => parseInt(id))
      .filter((id) => Number.isInteger(id));

    // Validate that all provided file IDs exist
    if (parsedFileIds.length > 0) {
      const existingFiles = await prisma.file.findMany({
        where: { file_id: { in: parsedFileIds } }
      });
      if (existingFiles.length !== parsedFileIds.length) {
        throw new Error('One or more provided file IDs do not exist');
      }
    }

    // Upload incoming attachment files (if any), then use their file IDs
    const uploadedFiles = await usersService.createFiles(files || [], announced_by, {
      storageTarget: "announcements",
    });
    const uploadedFileIds = uploadedFiles.map((file) => file.file_id);
    const finalFileIds = [...new Set([...parsedFileIds, ...uploadedFileIds])];

    const announcement = await prisma.announcement.create({
      data: {
        announcement_title,
        announcement_desc,
        announcement_type,
        announced_by,
        files: finalFileIds.length > 0 ? {
          create: finalFileIds.map(fileId => ({
            file_id: fileId
          }))
        } : undefined
      },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            photo_path: true,
            roles: {
              select: {
                role: true,
              },
            },
          }
        },
        files: {
          include: {
            file: true
          }
        }
      }
    });

    return announcement;
  },

  async updateAnnouncement(announcementId, updateData) {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    // Check if announcement exists before updating
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { announcement_id: announcementId },
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });
    if (!existingAnnouncement) {
      throw new Error('Announcement not found');
    }

    const {
      files = [],
      replace_attachments,
      remove_file_ids = [],
      updated_by,
      announcement_title,
      announcement_desc,
      announcement_type,
    } = updateData;

    const fieldsToUpdate = {
      ...(announcement_title !== undefined ? { announcement_title } : {}),
      ...(announcement_desc !== undefined ? { announcement_desc } : {}),
      ...(announcement_type !== undefined ? { announcement_type } : {}),
    };

    // Validate update fields if provided
    if (fieldsToUpdate.announcement_title !== undefined && fieldsToUpdate.announcement_title.trim() === '') {
      throw new Error('Announcement title cannot be empty');
    }
    if (fieldsToUpdate.announcement_desc !== undefined && fieldsToUpdate.announcement_desc.trim() === '') {
      throw new Error('Announcement description cannot be empty');
    }

    const parsedRemoveFileIds = (Array.isArray(remove_file_ids) ? remove_file_ids : [])
      .map((id) => parseInt(id))
      .filter((id) => Number.isInteger(id));

    const hasNewUploads = Array.isArray(files) && files.length > 0;
    const hasExplicitRemovals = parsedRemoveFileIds.length > 0;
    const shouldReplaceAttachments = replace_attachments === true;
    const shouldUpdateAttachments =
      shouldReplaceAttachments || hasNewUploads || hasExplicitRemovals;

    if (shouldUpdateAttachments && !updated_by) {
      throw new Error("Updating user not found");
    }

    let uploadedFiles = [];
    if (hasNewUploads) {
      uploadedFiles = await usersService.createFiles(files, updated_by, {
        storageTarget: "announcements",
      });
    }

    const uploadedFileIds = uploadedFiles.map((f) => f.file_id);
    const oldFiles = existingAnnouncement.files.map((af) => af.file);
    const existingAnnouncementFileIds = new Set(oldFiles.map((f) => f.file_id));

    const removableFileIds = shouldReplaceAttachments
      ? [...existingAnnouncementFileIds]
      : parsedRemoveFileIds.filter((id) => existingAnnouncementFileIds.has(id));

    const announcement = await prisma.announcement.update({
      where: { announcement_id: announcementId },
      data: {
        ...fieldsToUpdate,
        created_at: new Date(),
        ...(shouldUpdateAttachments
          ? {
              files: {
                ...(removableFileIds.length > 0
                  ? {
                      deleteMany: {
                        file_id: { in: removableFileIds },
                      },
                    }
                  : {}),
                ...(uploadedFileIds.length > 0
                  ? {
                      create: uploadedFileIds.map((fileId) => ({
                        file_id: fileId,
                      })),
                    }
                  : {}),
              },
            }
          : {}),
      },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            photo_path: true,
            roles: {
              select: {
                role: true,
              },
            },
          }
        },
        files: {
          include: {
            file: true
          }
        }
      }
    });

    if (removableFileIds.length > 0) {
      const removedFileIdSet = new Set(removableFileIds);
      const removedFiles = oldFiles.filter((f) => removedFileIdSet.has(f.file_id));
      const removedFileIds = removedFiles.map((f) => f.file_id);

      const references = await prisma.file.findMany({
        where: { file_id: { in: removedFileIds } },
        select: {
          file_id: true,
          file_path: true,
          _count: {
            select: {
              announcements: true,
              parent_child_files: true,
            },
          },
        },
      });

      const orphanedFiles = references.filter(
        (fileRef) =>
          fileRef._count.announcements === 0 &&
          fileRef._count.parent_child_files === 0,
      );

      if (orphanedFiles.length > 0) {
        await prisma.file.deleteMany({
          where: { file_id: { in: orphanedFiles.map((f) => f.file_id) } },
        });

        for (const file of orphanedFiles) {
          try {
            await deleteFileByUrl(file.file_path);
          } catch (error) {
            console.error(
              `[announcements.service] Failed deleting old announcement file from Supabase: ${file.file_path}`,
              error,
            );
          }
        }
      }
    }

    return announcement;
  },

  async deleteAnnouncement(announcementId) {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    // Check if announcement exists before deleting
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { announcement_id: announcementId }
    });
    if (!existingAnnouncement) {
      throw new Error('Announcement not found');
    }

    await prisma.announcement.delete({
      where: { announcement_id: announcementId }
    });

    return true;
  }
};

module.exports = announcementsService;