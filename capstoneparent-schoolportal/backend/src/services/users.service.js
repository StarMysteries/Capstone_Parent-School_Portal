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
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

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
        updated_at: true,
      },
    });

    return user;
  },

  async updateUserStatus(userId, accountStatus) {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

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

  /**
   * Replace a user's roles entirely in a single transaction.
   *
   * Flow:
   *   1. Verify user exists
   *   2. Delete all existing role records for the user
   *   3. Insert the new roles
   *
   * Using a transaction ensures the user is never left with no roles
   * if something fails halfway through.
   */
  async updateRoles(userId, roles) {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Deduplicate roles in case the client sends duplicates
    const uniqueRoles = [...new Set(roles)];

    const updatedRoles = await prisma.$transaction(async (tx) => {
      // Delete all current roles
      await tx.userRole_Model.deleteMany({
        where: { user_id: userId },
      });

      // Insert the new roles
      await tx.userRole_Model.createMany({
        data: uniqueRoles.map((role) => ({
          user_id: userId,
          role,
        })),
      });

      // Return the full user with updated roles
      return tx.userRole_Model.findMany({
        where: { user_id: userId },
      });
    });

    return updatedRoles;
  },

  async assignRole(userId, role) {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }

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
