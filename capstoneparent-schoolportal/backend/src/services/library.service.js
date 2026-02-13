const prisma = require("../config/database");

const libraryService = {
  async getAllMaterials({ page, limit, item_type, category_id, grade_level }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (item_type) {
      where.item_type = item_type;
    }
    if (category_id) {
      where.category_id = parseInt(category_id);
    }
    if (grade_level) {
      where.gl_id = parseInt(grade_level);
    }

    const [materials, total] = await Promise.all([
      prisma.learningMaterial.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          grade_level: true,
          uploader: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
            },
          },
          copies: true,
        },
        orderBy: {
          uploaded_at: "desc",
        },
      }),
      prisma.learningMaterial.count({ where }),
    ]);

    return {
      materials,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  async getMaterialById(materialId) {
    const material = await prisma.learningMaterial.findUnique({
      where: { item_id: materialId },
      include: {
        category: true,
        grade_level: true,
        uploader: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
        copies: {
          include: {
            borrow_records: {
              include: {
                student: true,
                user: {
                  select: {
                    user_id: true,
                    fname: true,
                    lname: true,
                  },
                },
              },
              orderBy: {
                borrowed_at: "desc",
              },
            },
          },
        },
      },
    });

    if (!material) {
      throw new Error("Material not found");
    }

    return material;
  },

  async createMaterial(materialData) {
    const { item_name, author, item_type, category_id, gl_id, uploaded_by } =
      materialData;

    const material = await prisma.learningMaterial.create({
      data: {
        item_name,
        author,
        item_type,
        category_id,
        gl_id,
        uploaded_by,
      },
      include: {
        category: true,
        grade_level: true,
        uploader: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    return material;
  },

  async updateMaterial(materialId, updateData) {
    const material = await prisma.learningMaterial.update({
      where: { item_id: materialId },
      data: updateData,
      include: {
        category: true,
        grade_level: true,
        uploader: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    return material;
  },

  async deleteMaterial(materialId) {
    await prisma.learningMaterial.delete({
      where: { item_id: materialId },
    });

    return true;
  },

  async addCopy(copyData) {
    const { item_id, copy_code, condition } = copyData;

    const copy = await prisma.materialCopy.create({
      data: {
        item_id,
        copy_code,
        condition,
      },
    });

    return copy;
  },

  async updateCopyStatus(copyId, updateData) {
    const { status, condition } = updateData;

    const copy = await prisma.materialCopy.update({
      where: { copy_id: copyId },
      data: {
        status,
        condition,
      },
    });

    return copy;
  },

  async borrowMaterial(borrowData) {
    const { copy_id, student_id, user_id, due_at } = borrowData;

    // Check if copy is available
    const copy = await prisma.materialCopy.findUnique({
      where: { copy_id },
    });

    if (!copy || copy.status !== "AVAILABLE") {
      throw new Error("Material copy is not available for borrowing");
    }

    // Calculate due date (1 week from now if not provided)
    const dueDate = due_at
      ? new Date(due_at)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create borrow record
    const record = await prisma.materialBorrowRecord.create({
      data: {
        copy_id,
        student_id,
        user_id,
        due_at: dueDate,
      },
      include: {
        copy: {
          include: {
            item: true,
          },
        },
        student: true,
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    // Update copy status to BORROWED
    await prisma.materialCopy.update({
      where: { copy_id },
      data: { status: "BORROWED" },
    });

    return record;
  },

  async returnMaterial(borrowId, returnData) {
    const { penalty_cost, remarks } = returnData;

    const record = await prisma.materialBorrowRecord.update({
      where: { mbr_id: borrowId },
      data: {
        returned_at: new Date(),
        penalty_cost: penalty_cost || 0,
        remarks,
      },
      include: {
        copy: true,
        student: true,
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });

    // Update copy status back to AVAILABLE
    await prisma.materialCopy.update({
      where: { copy_id: record.copy_id },
      data: { status: "AVAILABLE" },
    });

    return record;
  },

  async getBorrowHistory({ page, limit, student_id, user_id, status }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (student_id) {
      where.student_id = parseInt(student_id);
    }
    if (user_id) {
      where.user_id = parseInt(user_id);
    }

    // Filter by status
    if (status === "borrowed") {
      where.returned_at = null;
    } else if (status === "returned") {
      where.returned_at = { not: null };
    } else if (status === "overdue") {
      where.returned_at = null;
      where.due_at = { lt: new Date() };
    }

    const [records, total] = await Promise.all([
      prisma.materialBorrowRecord.findMany({
        where,
        skip,
        take,
        include: {
          copy: {
            include: {
              item: {
                include: {
                  category: true,
                },
              },
            },
          },
          student: true,
          user: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
            },
          },
        },
        orderBy: {
          borrowed_at: "desc",
        },
      }),
      prisma.materialBorrowRecord.count({ where }),
    ]);

    return {
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  async getAllCategories() {
    const categories = await prisma.category.findMany({
      orderBy: {
        category_name: "asc",
      },
    });

    return categories;
  },

  async createCategory(categoryName) {
    const category = await prisma.category.create({
      data: {
        category_name: categoryName,
      },
    });

    return category;
  },
};

module.exports = libraryService;
