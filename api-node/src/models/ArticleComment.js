const {ValidationError} = require('./../libs/APIError');
const validator = require('./../libs/validator');
const message = require('./../libs/message');

module.exports = (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define(
    'article_comment',
    {
      recuid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: message.getAndReplace('FIELD_REQUIRED', 'Comment')},
          notNull: {msg: message.getAndReplace('FIELD_REQUIRED', 'Comment')},
          len: {
            args: [3],
            msg: message.getAndReplaceMultiple('FIELD_MINIMUN_LENGTH', [
              'Comment',
              3,
            ]),
          },
        },
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: true,
      hooks: {
        // @todo: add hooks
        validationFailed: (instance, options, errors) => {
          throw new ValidationError(
            validator.formatValidationErrors(errors.errors)
          );
        },
      },

      validate: {
        // @todo: add validations
      },
    }
  );
  ArticleComment.associate = (models) => {
    ArticleComment.belongsTo(models.Article, {
      foreignKey: {
        name: 'articleId',
        field: 'article_id',
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'articleId'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'articleId'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'articleId'),
          },
        },
      },
      as: 'article',
    });
    ArticleComment.belongsTo(models.User, {
      foreignKey: {
        name: 'createdById',
        field: 'created_by_id',
        allowNull: false,
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'created_by_id'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'created_by_id'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'created_by_id'),
          },
        },
      },
      as: 'user',
    });
  };
  return ArticleComment;
};
