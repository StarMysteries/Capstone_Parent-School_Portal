const prisma = require('../config/database');

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
          role: role
        }
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
          roles: true
        },
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
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
        roles: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async updateUser(userId, updateData) {
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
        updated_at: true
      }
    });

    return user;
  },

  async updateUserStatus(userId, accountStatus) {
    const user = await prisma.user.update({
      where: { user_id: userId },
      data: { account_status: accountStatus },
      select: {
        user_id: true,
        email: true,
        fname: true,
        lname: true,
        account_status: true
      }
    });

    return user;
  },

  async assignRole(userId, role) {
    // Check if user already has this role
    const existingRole = await prisma.userRole_Model.findFirst({
      where: {
        user_id: userId,
        role: role
      }
    });

    if (existingRole) {
      throw new Error('User already has this role');
    }

    const userRole = await prisma.userRole_Model.create({
      data: {
        user_id: userId,
        role: role
      }
    });

    return userRole;
  },

  async removeRole(userId, roleId) {
    await prisma.userRole_Model.delete({
      where: {
        ur_id: roleId,
        user_id: userId
      }
    });

    return true;
  }
};

module.exports = usersService;