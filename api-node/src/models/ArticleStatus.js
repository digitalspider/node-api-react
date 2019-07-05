module.exports = (sequelize, DataTypes) => {
  const ArticleStatus = sequelize.define('article_status', {
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
    timestamps: false,
    hooks: {
      // @todo: add hooks
    },

    validate: {
      // @todo: add validations
    },
  });
  return ArticleStatus;
};
