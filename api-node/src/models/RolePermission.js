module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('role_permission', {},
    {
      timestamps: false,
      hooks: {
        // @todo: add hooks
      },

      validate: {
        // @todo: add validations
      },
    }
  );
  return RolePermission;
};
