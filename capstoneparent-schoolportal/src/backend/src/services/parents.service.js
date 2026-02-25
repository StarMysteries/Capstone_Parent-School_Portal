const prisma = require("../config/database");

const parentsService = {
  async createFiles(files, uploaded_by) {
    // files: array from multer
    const created = [];
    for (const f of files) {
      const file = await prisma.file.create({
        data: {
          file_name: f.originalname,
          file_path: f.path,
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
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    return registration;
  },

  async getMyChildren(parentId) {
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

    // Flatten the students array
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
          some: {
            student_id,
          },
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
          some: {
            student_id,
          },
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
