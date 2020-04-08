/*eslint no-process-env: "off"*/
require('dotenv').config();
const fs = require("fs");
const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  logger: {
    level: process.env.LOG_LEVEL,
    console: {
      enable: true,
      level: process.env.LOG_LEVEL,
    },
    defaultLevel: "debug",
    file: {
      compress: false,
      app: `${logFolder}/app.log`,
      error: `${logFolder}/error.log`,
      access: `${logFolder}/access.log`,
      format: '.yyyy-MM-dd',
    },
    appenders: ['CONSOLE', 'FILE', 'ERROR_ONLY'],
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX || 'staking:api:partner:cache',
    usingPass: process.env.REDIS_USING_PASS || 0,
    pass: process.env.REDIS_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE.toLowerCase() === 'true'
      : false,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    mailSendAs: process.env.MAIL_SEND_AS,
  },
  rateLimit: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
  stakingApi: {
    url: process.env.STAKING_API_URL,
    key: process.env.STAKING_API_KEY,
    secret: process.env.STAKING_API_SECRET,
    jwksUrl: process.env.STAKING_API_JWK_URL,
    kid: process.env.STAKING_API_KID,
  },
  db: {
    wallet: {
      database: process.env.WALLET_DB_NAME,
      username: process.env.WALLET_DB_USER,
      password: process.env.WALLET_DB_PASS,
      options: {
        host: process.env.WALLET_DB_HOST,
        port: process.env.WALLET_DB_PORT,
        dialect: 'postgres',
        logging: false
      }
    }
  },
  appLimit: process.env.APP_LIMIT || 10,
  token: {
    key: {
      private: fs.readFileSync(__dirname + "/../keys/private.key", "utf8"),
      public: fs.readFileSync(__dirname + "/../keys/public.key", "utf8")
    },
    signOption: {
      issuer: process.env.TOKEN_SIGN_I || "Moonstake",
      subject: process.env.TOKEN_SIGN_S || "info@moonstake.io",
      audience: process.env.TOKEN_SIGN_A || "https://www.moonstake.io/",
      expiresIn: process.env.TOKEN_EXPIRES_IN ? parseInt(process.env.TOKEN_EXPIRES_IN) : 84600,
      algorithm: "RS256"
    },
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) : 84600,
  },
  lockUser: {
    maximumAttemptsLogin: process.env.MAXIMUM_ATTEMPTS_LOGIN,
    lockTime: process.env.LOCK_TIME
  },
  expiredVefiryToken: process.env.EXPIRED_VERIFY_TOKEN ? parseInt(process.env.EXPIRED_VERIFY_TOKEN) : 2,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
};

module.exports = config;
