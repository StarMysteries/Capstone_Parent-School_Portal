const prisma = require('../config/database');

const announcementsService = {
  async getAllAnnouncements({ page, limit, type, userRoles }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    // Filter by type if provided
    if (type) {
      where.announcement_type = type;
    } else {
      // If user is not staff, only show General announcements
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
              lname: true
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
    const announcement = await prisma.announcement.findUnique({
      where: { announcement_id: announcementId },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
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
    const { announcement_title, announcement_desc, announcement_type, announced_by, file_ids } = announcementData;

    const announcement = await prisma.announcement.create({
      data: {
        announcement_title,
        announcement_desc,
        announcement_type,
        announced_by,
        files: file_ids ? {
          create: file_ids.map(fileId => ({
            file_id: fileId
          }))
        } : undefined
      },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
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
    const announcement = await prisma.announcement.update({
      where: { announcement_id: announcementId },
      data: updateData,
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
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

  async deleteAnnouncement(announcementId) {
    await prisma.announcement.delete({
      where: { announcement_id: announcementId }
    });

    return true;
  }
};

module.exports = announcementsService;