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

    // Check if grade level exists
    const gradeLevel = await prisma.gradeLevel.findUnique({
      where: { gl_id }
    });
    if (!gradeLevel) {
      throw new Error('Grade level not found');
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { section_id }
    });
    if (!section) {
      throw new Error('Section not found');
    }

    // Check if adviser exists
    const adviser = await prisma.user.findUnique({
      where: { user_id: class_adviser }
    });
    if (!adviser) {
      throw new Error('Adviser not found');
    }

    // Check if adviser is already assigned to another class in the same school year
    const existingAdviserClass = await prisma.classList.findFirst({
      where: {
        class_adviser,
        syear_start
      }
    });
    if (existingAdviserClass) {
      throw new Error('Adviser is already assigned to a class in this school year');
    }

    // Check if section is already used in the same grade level and school year
    const existingClass = await prisma.classList.findFirst({
      where: {
        gl_id,
        section_id,
        syear_start
      }
    });
    if (existingClass) {
      throw new Error('A class with this grade level and section already exists for this school year');
    }

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
    // Check if class exists
    const existingClass = await prisma.classList.findUnique({
      where: { clist_id: classId }
    });
    if (!existingClass) {
      throw new Error('Class not found');
    }

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
    // Check if class exists
    const existingClass = await prisma.classList.findUnique({
      where: { clist_id: classId }
    });
    if (!existingClass) {
      throw new Error('Class not found');
    }

    await prisma.classList.delete({
      where: { clist_id: classId }
    });

    return true;
  },

  async addSubjectToClass(classId, subjectData) {
    const { subject_name, time_start, time_end, subject_teacher } = subjectData;

    // Check if class exists
    const existingClass = await prisma.classList.findUnique({
      where: { clist_id: classId }
    });
    if (!existingClass) {
      throw new Error('Class not found');
    }

    // Check if teacher exists
    const teacher = await prisma.user.findUnique({
      where: { user_id: subject_teacher }
    });
    if (!teacher) {
      throw new Error('Teacher not found');
    }

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
    // Check if class exists
    const existingClass = await prisma.classList.findUnique({
      where: { clist_id: classId }
    });
    if (!existingClass) {
      throw new Error('Class not found');
    }

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
    // Check if subject record exists
    const subjectRecord = await prisma.subjectRecord.findUnique({
      where: { srecord_id: subject_id }
    });
    if (!subjectRecord) {
      throw new Error('Subject record not found');
    }

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { user_id: student_id }
    });
    if (!student) {
      throw new Error('Student not found');
    }

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
        student_id
      }
    });

    let gradeRecord;
    if (existingRecord) {
      gradeRecord = await prisma.subjectRecordStudent.update({
        where: { srs_id: existingRecord.srs_id },
        data: { q1_grade, q2_grade, q3_grade, q4_grade, avg_grade, remarks },
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

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { user_id: student_id }
    });
    if (!student) {
      throw new Error('Student not found');
    }

    // Check if days_present + days_absent exceeds school_days
    if (days_present + days_absent > school_days) {
      throw new Error('Days present and days absent cannot exceed total school days');
    }

    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: { student_id, month }
    });

    let attendance;
    if (existingRecord) {
      attendance = await prisma.attendanceRecord.update({
        where: { attendance_id: existingRecord.attendance_id },
        data: { school_days, days_present, days_absent }
      });
    } else {
      attendance = await prisma.attendanceRecord.create({
        data: { student_id, school_days, days_present, days_absent, month }
      });
    }

    return attendance;
  }
};

module.exports = classesService;