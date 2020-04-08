module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member_tokens", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    access_token_expire_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    refresh_token_expire_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 