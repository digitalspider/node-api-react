const message = require('./../libs/message');

module.exports = (sequelize, DataTypes) => {
  const ArticleStatusTransition = sequelize.define(
    'article_status_transition', {
      fromStatusId: {
        field: 'from_status_id',
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'fromStatusId'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'fromStatusId'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'fromStatusId'),
          },
        },
      },
      toStatusId: {
        field: 'to_status_id',
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'toStatusId'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'toStatusId'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'toStatusId'),
          },
        },
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
  return ArticleStatusTransition;
};
