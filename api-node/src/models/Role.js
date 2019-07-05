module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    recuid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
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
  return Role;
};
