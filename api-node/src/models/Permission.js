module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission',
    {
      permission_id: {
        primaryKey: true,
        type: DataTypes.CHAR,
      },
      method: {
        type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE'),
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
       type: DataTypes.CHAR,
        allowNull: false,
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
    }
  );
  return Permission;
};
