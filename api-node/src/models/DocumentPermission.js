const message = require('./../libs/message');

module.exports = (sequelize, DataTypes) => {
  const DocumentPermission = sequelize.define('document_permission', {
    userId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'userId'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'userId'),
        },
      },
    },
    documentId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'documentId'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'documentId'),
        },
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'type'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'type'),
        },
      },
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'type'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'type'),
        },
      },
    },
  },
  {
    timestamps: false,
  });
  return DocumentPermission;
};
