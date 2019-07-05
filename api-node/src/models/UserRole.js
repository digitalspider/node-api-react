module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('user_role', {
  },
  {
    timestamps: false,
    hooks: {
      // @todo: add hooks
    },

    validate: {
      // @todo: add validations
    },
  });
  return UserRole;
};
