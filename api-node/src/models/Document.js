const common = require('./../common');

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('document', {
    recuid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auditLabel: 'id',
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      auditLabel: 'Filename',
    },
    comment: {
      type: DataTypes.TEXT,
      auditLabel: 'Comment',
    },
    s3Key: {
      type: DataTypes.STRING,
      allowNull: false,
      auditExclude: true,
    },
    s3Version: {
      type: DataTypes.STRING,
      allowNull: false,
      auditExclude: true,
    },
  },
  {
    hooks: {
      // @todo: add hooks
    },
    auditEnable: true,
    auditParentType: 'article',
    validate: {
      // @todo: add validations
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: {
        name: 'createdById',
        field: 'created_by_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_USER,
        auditLabel: 'Creator',
      },
      as: 'createdBy',
    });
    Document.belongsToMany(models.User, {
      through: models.DocumentPermission,
      foreignKey: {
        name: 'documentId',
        field: 'document_id',
        allowNull: false,
      },
      otherKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false,
      },
      as: 'documentPermissions',
    });
    Document.belongsToMany(models.Article, {
      through: models.ArticleDocument,
      foreignKey: {
        name: 'documentId',
        field: 'document_id',
        allowNull: false,
      },
      otherKey: {
        name: 'articleId',
        field: 'article_id',
        allowNull: false,
      },
      as: 'articleDocuments',
    });
    Document.belongsToMany(models.ArticleDocType, {
      through: models.ArticleDocument,
      foreignKey: {
        name: 'documentId',
        field: 'document_id',
        allowNull: false,
      },
      otherKey: {
        name: 'typeId',
        field: 'type_id',
        allowNull: false,
      },
      as: 'articleDocType',
    });
  };
  return Document;
};
