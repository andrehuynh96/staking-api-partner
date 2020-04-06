

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("members", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    member_sts: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    twofa_secret: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    twofa_enable_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    twofa_download_key_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    referral_code: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    referrer_code: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    infinito_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    kyc_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '0'
    },
    kyc_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    kyc_status: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    latest_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attempt_login_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 