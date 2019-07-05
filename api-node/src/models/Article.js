const {ValidationError} = require('./../libs/APIError');
const validator = require('./../libs/validator');
const message = require('./../libs/message');
const common = require('./../common');

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
    recuid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      auditLabel: 'id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: message.getAndReplace('FIELD_REQUIRED', 'Title')},
        notNull: {msg: message.getAndReplace('FIELD_REQUIRED', 'Title')},
      },
    },
    code: {
      type: DataTypes.STRING,
      validate: {
        function(value) {
          validator.isAlphaNumericWithSymbols('Code', value);
        },
      },
    },
    scheduleCode: {
      type: DataTypes.STRING,
      auditLabel: 'Schedule Code',
      validate: {
        function(value) {
          validator.isAlphaNumericWithSymbols('Schedule Code', value);
        },
      },
    },
    purchaseOrderNo: {
      type: DataTypes.STRING,
      auditLabel: 'Purchase Order Number',
      validate: {
        function(value) {
          validator.isAlphaNumericWithSymbols('Purchase Order Number', value);
        },
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      auditLabel: 'Additional Instructions',
      validate: {
        function(value) {
          validator.isAlphaNumericWithSymbols('Additional Instructions', value);
        },
      },
    },
    costCentreName: {
      type: DataTypes.STRING,
      auditLabel: 'Cost Centre Name',
      validate: {
        function(value) {
          validator.isAlphaNumericWithSymbols('Cost Centre Name', value);
        },
      },
    },
      costCentreCode: {
        type: DataTypes.STRING,
        auditLabel: 'Cost Centre Code',
        validate: {
          function(value) {
            validator.isAlphaNumericWithSymbols('Cost Centre Code', value);
          },
        },
      },
    productCode: {
      type: DataTypes.STRING,
    },
    displayName: {
      type: DataTypes.VIRTUAL,
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
      auditEnable: true,
      validate: {
        // @todo: add validations
      },
      scopes: {
        organisation: (value) => {
          return {
            where: {
              '$email$': value,
            },
          };
        },
        user: (value) => {
          const {Sequelize} = require('.');
          return {
            where: {
              [Sequelize.Op.or]: {
                '$createdBy.recuid$': value,
                '$requester.recuid$': value,
              },
            },
          };
        },
      },
    });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: {
        name: 'accountManagerId',
        field: 'account_manager_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_USER,
        auditLabel: 'Account Manager',
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'accountManagerId'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'accountManagerId'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'accountManagerId'),
          },
        },
      },
      as: 'accountManager',
    });
    Article.belongsTo(models.User, {
      foreignKey: {
        name: 'requesterId',
        field: 'requester_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_USER,
        auditLabel: 'Requester',
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'requesterId'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'requesterId'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'requesterId'),
          },
        },
      },
      as: 'requester',
    });
    Article.belongsTo(models.User, {
      foreignKey: {
        name: 'createdById',
        field: 'created_by_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_USER,
        auditLabel: 'Creator',
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'createdById'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'createdById'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'createdById'),
          },
        },
      },
      as: 'createdBy',
    });
    Article.belongsTo(models.ArticleType, {
      foreignKey: {
        name: 'articleTypeId',
        field: 'article_type_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_ADV_TYPE,
        auditLabel: 'Type',
        validate: {
          notEmpty: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Article Type'),
          },
          notNull: {
            msg: message.getAndReplace('FIELD_REQUIRED', 'Article Type'),
          },
          isNumeric: {
            msg: message.getAndReplace('FIELD_NUMERIC', 'Article Type'),
          },
        },
      },
      as: 'articleType',
    });
    Article.belongsTo(models.ArticleStatus, {
      foreignKey: {
        name: 'articleStatusId',
        field: 'article_status_id',
        allowNull: false,
        auditType: common.audit.AUDIT_TYPE_ADV_STATUS,
        auditLabel: 'Status',
        validate: {
          notEmpty: {
            msg: message.getAndReplace(
              'FIELD_REQUIRED',
              'articleStatusId'
            ),
          },
          notNull: {
            msg: message.getAndReplace(
              'FIELD_REQUIRED',
              'articleStatusId'
            ),
          },
          isNumeric: {
            msg: message.getAndReplace(
              'FIELD_NUMERIC',
              'articleStatusId'
            ),
          },
        },
      },
      as: 'articleStatus',
    });
    Article.belongsToMany(models.Document, {
      through: models.ArticleDocument,
      foreignKey: {
        name: 'articleId',
        field: 'article_id',
        allowNull: false,
      },
      otherKey: {
        name: 'documentId',
        field: 'document_id',
        allowNull: false,
      },
      as: 'attachments',
    });
  };
  return Article;
};
