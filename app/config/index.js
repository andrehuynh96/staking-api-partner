/* eslint no-process-env: "off"*/
require('dotenv').config();
const fs = require("fs");
const pkg = require('../../package.json');

const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  app: {
    name: process.env.APP_NAME || 'staking-api-partner',
    version: pkg.version,
    description: pkg.description,
    buildNumber: process.env.BUILD_NUMBER || process.env.CI_JOB_ID || '',
    port: parseInt(process.env.PORT || process.env.APP_PORT),
  },
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
  expiredSsoTokenInMinutes: parseInt(process.env.EXPIRED_SSO_TOKEN_IN_MINUTES || '2'),
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  twofaStep: process.env.TWOFA_STEP ? parseInt(process.env.TWOFA_STEP) : 3,
  plutxUserID: {
    apiUrl: process.env.PLUTX_USERID_API_URL,
    apiKey: process.env.PLUTX_USERID_APP_API_KEY,
    secretKey: process.env.PLUTX_USERID_APP_SECRET_KEY,
  },
  website: {
    url: process.env.WEBSITE_URL,
    urlImages: process.env.PARTNER_NAME ? process.env.WEBSITE_URL + '/images/' + process.env.PARTNER_NAME.toLowerCase() : process.env.WEBSITE_URL + '/images',
    ssoLoginUrl: process.env.WEBSITE_URL + '/sign-in?token=',
    urlActive: process.env.WEBSITE_URL + '/email-verification?token=',
  },
  rewardSystem: {
    url: process.env.AFFILIATE_URL,
    apiKey: process.env.AFFILIATE_API_KEY,
    secretKey: process.env.AFFILIATE_SECRET_KEY,
    affiliateTypeId: process.env.AFFILIATE_TYPE_ID,
    membershipTypeId: process.env.MEMBERSHIP_AFFILIATE_TYPE_ID
  },
  emailTemplate: {
    partnerName: process.env.PARTNER_NAME,
    verifyEmail: process.env.PARTNER_NAME.toLowerCase() + "/verify-email.ejs"
  },
  membership: {
    referralUrl: process.env.WEBSITE_URL + '/sign-up?ref='
  },
  exchange: {
    changelly: {
      url: process.env.CHANGELLY_URL,
      apiKey: process.env.CHANGELLY_API_KEY,
      secretKey: process.env.CHANGELLY_API_SECRET
    }
  },
  webWallet: {
    apiUrl: process.env.WEB_WALLET_API_URL || 'https://dev-staking-wallet-web.chainservices.info',
  },
  setting: {
    MS_POINT_DELAY_TIME_IN_SECONDS: "MS_POINT_DELAY_TIME_IN_SECONDS",
    MS_POINT_STAKING_IS_ENABLED: "MS_POINT_STAKING_IS_ENABLED",
    MS_POINT_EXCHANGE_IS_ENABLED: "MS_POINT_EXCHANGE_IS_ENABLED",
    MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED: "MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED",
  },
  cacheDurationTime: process.env.CACHE_DURATION_TIME || 10,
  fiat: {
    wyre: {
      url: process.env.WYRE_URL,
      apiKey: process.env.WYRE_API_KEY,
      secretKey: process.env.WYRE_SECRET_KEY,
      accountId: process.env.WYRE_ACCOUNT_ID
    }
  },
  banking: {
    nexo: {
      usingIBP: process.env.NEXO_USING_IBP == "1",
      url: process.env.NEXO_URL,
      apiKey: process.env.NEXO_API_KEY,
    }
  },
  sdk: {
    baseUrl: process.env.SDK_URL,
    apiKey: process.env.SDK_API_KEY,
    secretKey: process.env.SDK_SECRET_KEY
  },
  hangoutError: {
    isEnabled: process.env.HANGOUT_ERROR_IS_ENABLED === 'true',
    logLevel: process.env.HANGOUT_ERROR_LOG_LEVEL || 'error',
    webhookUrl: process.env.HANGOUT_ERROR_CHANEL_WEBHOOK_URL,
  },
};

module.exports = config;
