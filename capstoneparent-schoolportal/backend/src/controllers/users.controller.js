const usersService = require('../services/users.service');

const usersController = {
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, status } = req.query;
      const result = await usersService.getAllUsers({ page, limit, role, status });
      res.status(200).json({
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await usersService.getUserById(parseInt(id));
      res.status(200).json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await usersService.updateUser(parseInt(id), updateData);
      res.status(200).json({
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { account_status } = req.body;
      const user = await usersService.updateUserStatus(parseInt(id), account_status);
      res.status(200).json({
        message: 'User status updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async assignRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const userRole = await usersService.assignRole(parseInt(id), role);
      res.status(201).json({
        message: 'Role assigned successfully',
        data: userRole
      });
    } catch (error) {
      next(error);
    }
  },

  async removeRole(req, res, next) {
    try {
      const { id, roleId } = req.params;
      await usersService.removeRole(parseInt(id), parseInt(roleId));
      res.status(200).json({
        message: 'Role removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = usersController;