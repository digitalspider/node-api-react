const message = require('./../libs/message');

module.exports = (sequelize, DataTypes) => {
  const ArticleDocument = sequelize.define('article_document', {
    articleId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'articleId'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'articleId'),
        },
      },
    },
    documentId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'documentId'),
        },
        notNull: {
          msg: message.getAndReplace('FIELD_REQUIRED', 'documentId'),
        },
      },
    },
    typeId: {
      type: DataTypes.INTEGER,
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
  ArticleDocument.associate = (models) => {
    ArticleDocument.belongsTo(models.ArticleDocType, {
      foreignKey: {
        name: 'typeId',
        field: 'type_id',
        allowNull: false,
      },
      as: 'articleDocType',
    });
  };
  return ArticleDocument;
};
