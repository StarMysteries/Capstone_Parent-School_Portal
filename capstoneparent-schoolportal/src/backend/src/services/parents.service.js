const prisma = require("../config/database");
const fs = require("fs");

// optional supabase client for storage uploads
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  const { createClient } = require("@supabase/supabase-js");
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );
}

const parentsService = {
  async createFiles(files, uploaded_by) {
    // Check if uploader exists
    const uploader = await prisma.user.findUnique({
      where: { user_id: uploaded_by },
    });
    if (!uploader) {
      throw new Error("Uploader not found");
    }

    const created = [];
    for (const f of files) {
      let storedPath = f.path;

      if (supabase) {
        const bucket = process.env.SUPABASE_BUCKET || "parent-docs";
        const destPath = `${Date.now()}_${f.originalname}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(destPath, fs.createReadStream(f.path), {
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error.message || error);
        } else {
          storedPath = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${destPath}`;
        }
        fs.unlink(f.path, () => {});
      }

      const file = await prisma.file.create({
        data: {
          file_name: f.originalname,
          file_path: storedPath,
          file_type: f.mimetype,
          file_size: f.size,
          uploaded_by,
        },
      });
      created.push(file);
    }
    return created;
  },

  async submitRegistration({ parent_id, student_ids, file_ids }) {
    // Check if parent exists
    const parent = await prisma.user.findUnique({
      where: { user_id: parent_id },
    });
    if (!parent) {
      throw new Error("Parent not found");
    }

    // Check if parent already has a pending or verified registration
    const existingRegistration = await prisma.parentRegistration.findFirst({
      where: {
        parent_id,
        status: { in: ["PENDING", "VERIFIED"] },
      },
    });
    if (existingRegistration) {
      throw new Error("Parent already has an active or pending registration");
    }

    // Check if all students exist
    const students = await prisma.student.findMany({
      where: { student_id: { in: student_ids } },
    });
    if (students.length !== student_ids.length) {
      throw new Error("One or more students not found");
    }

    // Check if all file IDs exist
    if (file_ids && file_ids.length > 0) {
      const files = await prisma.file.findMany({
        where: { file_id: { in: file_ids } },
      });
      if (files.length !== file_ids.length) {
        throw new Error("One or more files not found");
      }
    }

    const registration = await prisma.parentRegistration.create({
      data: {
        parent_id,
        students: {
          create: student_ids.map((studentId) => ({
            student_id: studentId,
          })),
        },
        files: file_ids
          ? {
              create: file_ids.map((fileId) => ({
                file_id: fileId,
              })),
            }
          : undefined,
      },
      include: {
        students: {
          include: {
            student: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    return registration;
  },

  async getAllRegistrations({ page, limit, status }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const [registrations, total] = await Promise.all([
      prisma.parentRegistration.findMany({
        where,
        skip,
        take,
        include: {
          parent: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
              email: true,
              contact_num: true,
            },
          },
          students: {
            include: {
              student: {
                include: {
                  grade_level: true,
                },
              },
            },
          },
          files: {
            include: {
              file: true,
            },
          },
          verifier: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
            },
          },
        },
        orderBy: {
          submitted_at: "desc",
        },
      }),
      prisma.parentRegistration.count({ where }),
    ]);

    return {
      registrations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  async getRegistrationById(registrationId) {
    const registration = await prisma.parentRegistration.findUnique({
      where: { pr_id: registrationId },
      include: {
        parent: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            email: true,
            contact_num: true,
          },
        },
        students: {
          include: {
            student: {
              include: {
                grade_level: true,
              },
            },
          },
        },
        files: {
          include: {
            file: true,
          },
        },
        verifier: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    return registration;
  },

  async verifyRegistration({ pr_id, status, remarks, verified_by }) {
    // Check if registration exists
    const existingRegistration = await prisma.parentRegistration.findUnique({
      where: { pr_id },
    });
    if (!existingRegistration) {
      throw new Error("Registration not found");
    }

    // Check if registration is already verified or rejected
    if (existingRegistration.status !== "PENDING") {
      throw new Error("Registration has already been processed");
    }

    // Check if verifier exists
    const verifier = await prisma.user.findUnique({
      where: { user_id: verified_by },
    });
    if (!verifier) {
      throw new Error("Verifier not found");
    }

    const registration = await prisma.parentRegistration.update({
      where: { pr_id },
      data: {
        status,
        remarks,
        verified_by,
        verified_at: new Date(),
      },
      include: {
        parent: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            email: true,
            account_status: true,
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    // If the registration was approved, activate the parent account
    if (status === "VERIFIED" && registration.parent) {
      await prisma.user.update({
        where: { user_id: registration.parent.user_id },
        data: { account_status: "Active" },
      });
    }

    return registration;
  },

  async getMyChildren(parentId) {
    // Check if parent exists
    const parent = await prisma.user.findUnique({
      where: { user_id: parentId },
    });
    if (!parent) {
      throw new Error("Parent not found");
    }

    const verifiedRegistrations = await prisma.parentRegistration.findMany({
      where: {
        parent_id: parentId,
        status: "VERIFIED",
      },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade_level: true,
              },
            },
          },
        },
      },
    });

    const children = verifiedRegistrations.flatMap((reg) =>
      reg.students.map((s) => s.student),
    );

    return children;
  },

  async getChildGrades({ parent_id, student_id }) {
    // Verify parent has access to this child
    const hasAccess = await prisma.parentRegistration.findFirst({
      where: {
        parent_id,
        status: "VERIFIED",
        students: {
          some: { student_id },
        },
      },
    });
    if (!hasAccess) {
      throw new Error("Access denied to this student record");
    }

    const grades = await prisma.subjectRecordStudent.findMany({
      where: { student_id },
      include: {
        subject_record: {
          include: {
            teacher: {
              select: {
                user_id: true,
                fname: true,
                lname: true,
              },
            },
          },
        },
      },
    });

    return grades;
  },

  async getChildAttendance({ parent_id, student_id }) {
    // Verify parent has access to this child
    const hasAccess = await prisma.parentRegistration.findFirst({
      where: {
        parent_id,
        status: "VERIFIED",
        students: {
          some: { student_id },
        },
      },
    });
    if (!hasAccess) {
      throw new Error("Access denied to this student record");
    }

    const attendance = await prisma.attendanceRecord.findMany({
      where: { student_id },
      orderBy: {
        month: "asc",
      },
    });

    return attendance;
  },
};

module.exports = parentsService;
