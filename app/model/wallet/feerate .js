module.exports = (sequelize, DataTypes) => {
  return sequelize.define("feerates", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    symbol: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    high: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    low: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    medium: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 