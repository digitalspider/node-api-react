module.exports = (sequelize, DataTypes) => {
  const ArticleType = sequelize.define('articletype', {
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
    hooks: {
      // @todo: add hooks
    },

    validate: {
      // @todo: add validations
    },
  });
  return ArticleType;
};
