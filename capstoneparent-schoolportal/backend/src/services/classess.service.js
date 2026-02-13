const prisma = require('../config/database');

const classesService = {
  async getAllClasses({ page, limit, school_year, grade_level }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (school_year) {
      where.syear_start = parseInt(school_year);
    }
    if (grade_level) {
      where.gl_id = parseInt(grade_level);
    }

    const [classes, total] = await Promise.all([
      prisma.classList.findMany({
        where,
        skip,
        take,
        include: {
          grade_level: true,
          section: true,
          adviser: {
            select: {
              user_id: true,
              fname: true,
              lname: true
            }
          }
        },
        orderBy: {
          syear_start: 'desc'
        }
      }),
      prisma.classList.count({ where })
    ]);

    return {
      classes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  },

  async getClassById(classId) {
    const classData = await prisma.classList.findUnique({
      where: { clist_id: classId },
      include: {
        grade_level: true,
        section: true,
        adviser: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        },
        subject_records: {
          include: {
            subject_record: {
              include: {
                teacher: {
                  select: {
                    user_id: true,
                    fname: true,
                    lname: true
                  }
                },
                students: {
                  include: {
                    student: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!classData) {
      throw new Error('Class not found');
    }

    return classData;
  },

  async createClass(classData) {
    const { gl_id, section_id, class_adviser, syear_start, syear_end, class_sched } = classData;

    const newClass = await prisma.classList.create({
      data: {
        gl_id,
        section_id,
        class_adviser,
        syear_start,
        syear_end,
        class_sched
      },
      include: {
        grade_level: true,
        section: true,
        adviser: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        }
      }
    });

    return newClass;
  },

  async updateClass(classId, updateData) {
    const updatedClass = await prisma.classList.update({
      where: { clist_id: classId },
      data: updateData,
      include: {
        grade_level: true,
        section: true,
        adviser: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        }
      }
    });

    return updatedClass;
  },

  async deleteClass(classId) {
    await prisma.classList.delete({
      where: { clist_id: classId }
    });

    return true;
  },

  async addSubjectToClass(classId, subjectData) {
    const { subject_name, time_start, time_end, subject_teacher } = subjectData;

    // Create subject record
    const subjectRecord = await prisma.subjectRecord.create({
      data: {
        subject_name,
        time_start: new Date(`1970-01-01T${time_start}:00`),
        time_end: new Date(`1970-01-01T${time_end}:00`),
        subject_teacher
      }
    });

    // Link to class
    await prisma.classListSubjectRecord.create({
      data: {
        clist_id: classId,
        srecord_id: subjectRecord.srecord_id
      }
    });

    return subjectRecord;
  },

  async getClassSubjects(classId) {
    const subjects = await prisma.classListSubjectRecord.findMany({
      where: { clist_id: classId },
      include: {
        subject_record: {
          include: {
            teacher: {
              select: {
                user_id: true,
                fname: true,
                lname: true
              }
            },
            students: {
              include: {
                student: true
              }
            }
          }
        }
      }
    });

    return subjects.map(s => s.subject_record);
  },

  async updateStudentGrades({ subject_id, student_id, q1_grade, q2_grade, q3_grade, q4_grade }) {
    // Calculate average grade
    const grades = [q1_grade, q2_grade, q3_grade, q4_grade].filter(g => g !== undefined && g !== null);
    const avg_grade = grades.length > 0 
      ? Math.round(grades.reduce((sum, g) => sum + g, 0) / grades.length)
      : null;

    // Determine remarks
    let remarks = 'IN_PROGRESS';
    if (avg_grade !== null) {
      remarks = avg_grade >= 75 ? 'PASSED' : 'FAILED';
    }

    // Upsert student record
    const existingRecord = await prisma.subjectRecordStudent.findFirst({
      where: {
        srecord_id: subject_id,
        student_id: student_id
      }
    });

    let gradeRecord;
    if (existingRecord) {
      gradeRecord = await prisma.subjectRecordStudent.update({
        where: { srs_id: existingRecord.srs_id },
        data: {
          q1_grade,
          q2_grade,
          q3_grade,
          q4_grade,
          avg_grade,
          remarks
        },
        include: {
          student: true,
          subject_record: true
        }
      });
    } else {
      gradeRecord = await prisma.subjectRecordStudent.create({
        data: {
          srecord_id: subject_id,
          student_id,
          q1_grade,
          q2_grade,
          q3_grade,
          q4_grade,
          avg_grade,
          remarks
        },
        include: {
          student: true,
          subject_record: true
        }
      });
    }

    return gradeRecord;
  },

  async updateAttendance(attendanceData) {
    const { student_id, school_days, days_present, days_absent, month } = attendanceData;

    // Check if record exists
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        student_id,
        month
      }
    });

    let attendance;
    if (existingRecord) {
      attendance = await prisma.attendanceRecord.update({
        where: { attendance_id: existingRecord.attendance_id },
        data: {
          school_days,
          days_present,
          days_absent
        }
      });
    } else {
      attendance = await prisma.attendanceRecord.create({
        data: {
          student_id,
          school_days,
          days_present,
          days_absent,
          month
        }
      });
    }

    return attendance;
  }
};

module.exports = classesService;