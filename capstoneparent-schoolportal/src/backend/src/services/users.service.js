const prisma = require("../config/database");

const usersService = {
  async getAllUsers({ page, limit, role, status }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) {
      where.account_status = status;
    }
    if (role) {
      where.roles = {
        some: {
          role: role,
        },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          user_id: true,
          email: true,
          fname: true,
          lname: true,
          contact_num: true,
          address: true,
          account_status: true,
          photo_path: true,
          created_at: true,
          roles: true,
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        contact_num: true,
        address: true,
        account_status: true,
        photo_path: true,
        created_at: true,
        updated_at: true,
        roles: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async updateUser(userId, updateData) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if new email is already taken by another user
    if (updateData.email && updateData.email !== existingUser.email) {
      const duplicateEmail = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (duplicateEmail) {
        throw new Error("Email is already in use");
      }
    }

    const user = await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        contact_num: true,
        address: true,
        account_status: true,
        photo_path: true,
        updated_at: true,
      },
    });

    return user;
  },

  async updateUserStatus(userId, accountStatus) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if account is already in the requested status
    if (existingUser.account_status === accountStatus) {
      throw new Error(`User account is already ${accountStatus}`);
    }

    const user = await prisma.user.update({
      where: { user_id: userId },
      data: { account_status: accountStatus },
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        account_status: true,
      },
    });

    return user;
  },

  async assignRole(userId, role) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if user already has this role
    const existingRole = await prisma.userRole_Model.findFirst({
      where: { user_id: userId, role },
    });
    if (existingRole) {
      throw new Error("User already has this role");
    }

    const userRole = await prisma.userRole_Model.create({
      data: { user_id: userId, role },
    });

    return userRole;
  },

  async removeRole(userId, roleId) {
    // Check if the role record exists and belongs to the user
    const existingRole = await prisma.userRole_Model.findFirst({
      where: { ur_id: roleId, user_id: userId },
    });
    if (!existingRole) {
      throw new Error("Role not found for this user");
    }

    await prisma.userRole_Model.delete({
      where: { ur_id: roleId, user_id: userId },
    });

    return true;
  },
};

module.exports = usersService;
