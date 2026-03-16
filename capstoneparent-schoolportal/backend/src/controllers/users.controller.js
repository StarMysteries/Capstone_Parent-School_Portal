const usersService = require("../services/users.service");

const usersController = {
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, status } = req.query;
      const result = await usersService.getAllUsers({
        page,
        limit,
        role,
        status,
      });

      res.status(200).json({
        data: result.users,
        pagination: result.pagination,
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
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await usersService.updateUser(parseInt(id), updateData);

      res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Email is already in use") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { account_status } = req.body;
      const user = await usersService.updateUserStatus(
        parseInt(id),
        account_status,
      );

      res.status(200).json({
        message: "User status updated successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.startsWith("User account is already")) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  },

  /**
   * PUT /users/:id/roles
   * Replaces all roles for a user in one request.
   * Body: { "roles": ["Teacher", "Parent"] }
   */
  async updateRoles(req, res, next) {
    try {
      const { id } = req.params;
      const { roles } = req.body;

      const updatedRoles = await usersService.updateRoles(parseInt(id), roles);

      res.status(200).json({
        message: "Roles updated successfully",
        data: updatedRoles,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async assignRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const userRole = await usersService.assignRole(parseInt(id), role);

      res.status(201).json({
        message: "Role assigned successfully",
        data: userRole,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "User already has this role") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  },

  async removeRole(req, res, next) {
    try {
      const { id, roleId } = req.params;
      await usersService.removeRole(parseInt(id), parseInt(roleId));

      res.status(200).json({
        message: "Role removed successfully",
      });
    } catch (error) {
      if (error.message === "Role not found for this user") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
};

module.exports = usersController;
