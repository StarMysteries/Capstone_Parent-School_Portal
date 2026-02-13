const prisma = require("../config/database");

const studentsService = {
  async getAllStudents({ page, limit, status, grade_level, syear_start }) {
    // Changed
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }
    if (grade_level) {
      where.gl_id = parseInt(grade_level);
    }
    if (syear_start) {
      where.syear_start = parseInt(syear_start);
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take,
        include: {
          grade_level: true,
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.student.count({ where }),
    ]);

    return {
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },
  async getStudentById(studentId) {
    const student = await prisma.student.findUnique({
      where: { student_id: studentId },
      include: {
        grade_level: true,
        subject_records: {
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
        },
        attendance_records: true,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  },

  async createStudent(studentData) {
    const { fname, lname, sex, lrn_number, gl_id, syear_start, syear_end } =
      studentData;

    const student = await prisma.student.create({
      data: {
        fname,
        lname,
        sex,
        lrn_number,
        gl_id,
        syear_start,
        syear_end,
      },
      include: {
        grade_level: true,
      },
    });

    return student;
  },

  async updateStudent(studentId, updateData) {
    const student = await prisma.student.update({
      where: { student_id: studentId },
      data: updateData,
      include: {
        grade_level: true,
      },
    });

    return student;
  },

  async deleteStudent(studentId) {
    await prisma.student.delete({
      where: { student_id: studentId },
    });

    return true;
  },

  async getStudentGrades(studentId) {
    const grades = await prisma.subjectRecordStudent.findMany({
      where: { student_id: studentId },
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

  async getStudentAttendance(studentId) {
    const attendance = await prisma.attendanceRecord.findMany({
      where: { student_id: studentId },
      orderBy: {
        month: "asc",
      },
    });

    return attendance;
  },
};

module.exports = studentsService;
