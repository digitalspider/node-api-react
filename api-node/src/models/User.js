'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    recuid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {},
    },
    guid: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {},
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {},
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        // @todo: valid email?
      },
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {},
    },
    token: {
      type: DataTypes.STRING,
      validate: {},
    },
    title: {
      type: DataTypes.STRING,
      validate: {},
    },
    position: {
      type: DataTypes.STRING,
      validate: {},
    },
    phone: {
      type: DataTypes.STRING,
      validate: {},
    },
    mobile: {
      type: DataTypes.STRING,
      validate: {},
    },
    lastVisit: {
      allowNull: true,
      type: DataTypes.DATE,
      validate: {},
    },
    tokenExpiryDate: {
      allowNull: true,
      type: DataTypes.DATE,
      validate: {},
    },
    totalVisits: {
      allowNull: true,
      type: DataTypes.INTEGER,
      validate: {},
    },
  },
  {
    defaultScope: {
      attributes: {
        include: [
          'createdBy',
        ],
        exclude: [
          'password',
          'guid',
          'token',
          'tokenExpiryDate',
          'createdAt',
          'deletedAt',
        ],
      },
    },
    hooks: {
      // @todo: add hooks
    },
    validate: {
      // @todo: add validations
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.User, {
      targetKey: 'recuid',
      foreignKey: {
        name: 'createdBy',
        field: 'created_by',
        allowNull: false,
      },
      as: 'creator',
    });
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false,
      },
      otherKey: {
        name: 'roleId',
        field: 'role_id',
        allowNull: false,
      },
      as: 'roles',
    });
    User.belongsToMany(models.Document, {
      through: models.DocumentPermission,
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false,
      },
      otherKey: {
        name: 'documentId',
        field: 'document_id',
        allowNull: false,
      },
      as: 'documentPermissions',
    });
  };
  return User;
};
