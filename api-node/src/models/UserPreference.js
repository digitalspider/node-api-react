module.exports = (sequelize, DataTypes) => {
  const UserPreference = sequelize.define('user_preference', {
    defaultSite: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    displayDisabledUsers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    useTabs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  UserPreference.associate = (models) => {
    UserPreference.belongsTo(models.User, {
      primaryKey: true,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false,
      },
      as: 'user',
    });
  };
  UserPreference.removeAttribute('id');
  return UserPreference;
};
