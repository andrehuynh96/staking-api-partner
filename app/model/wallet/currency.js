const CurrencyStatus = require("./value-object/currency-status");
const CurrencyType = require("./value-object/currency-type");
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("currencies", {
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
    icon: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    sc_token_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: CurrencyType.NATIVE
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: CurrencyStatus.ENABLED
    },
    mobile_ios_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: CurrencyStatus.ENABLED
    },
    mobile_android_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: CurrencyStatus.ENABLED
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    default_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    web_site_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    network: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    explore_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    transaction_format_link: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    address_format_link: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
}
