const message = require('./../libs/message');

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('audit_log', {
      objectType: {
        field: 'object_type',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Object Type'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Object Type'),
          },
        },
      },
      objectId: {
        field: 'object_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Object Id'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Object Id'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'Object Id'),
          },
        },
      },
      event: {
        field: 'event',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Event'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Event'),
          },
        },
      },
      detail: {
        field: 'detail',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Details'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Details'),
          },
        },
      },
      parentType: {
        field: 'parent_type',
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        field: 'parent_id',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      paranoid: false,
    }
  );

  AuditLog.associate = (models) => {
    AuditLog.removeAttribute('id');
    AuditLog.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'User Id'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'User Id'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'User Id'),
          },
        },
      },
      as: 'user',
    });
  };

  return AuditLog;
};
