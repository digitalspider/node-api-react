module.exports = (sequelize, DataTypes) => {
  const ArticleDocType = sequelize.define('article_doc_type', {
    recuid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    defaultScope: {
      order: [['name']],
    },
    timestamps: false,
  });
  ArticleDocType.associate = (models) => {
    ArticleDocType.hasMany(models.ArticleDocument, {
      foreignKey: {
        name: 'typeId',
        field: 'type_id',
        allowNull: false,
      },
      as: 'articleDocuments',
    });
  };
  return ArticleDocType;
};
