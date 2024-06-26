const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].name': '[].name',
    '[].phone': '[].phone',
    '[].twofa_enable_flg': '[].twofa_enable_flg',
    '[].twofa_download_key_flg': '[].twofa_download_key_flg',
    '[].created_at': '[].created_at',
    '[].member_sts': '[].member_sts',
    '[].fullname': '[].fullname',
    '[].phone': '[].phone',
    '[].date_of_birth': '[].date_of_birth',
    '[].address': '[].address',
    '[].city': '[].city',
    '[].post_code': '[].post_code',
    '[].country': '[].country',
    '[].referral_code': '[].referral_code',
    '[].referrer_code': '[].referrer_code',
    '[].infinito_id': '[].infinito_id',
    '[].latest_login_at': '[].latest_login_at',
    '[].kyc_id': '[].kyc_id',
    '[].kyc_level': '[].kyc_level',
    '[].kyc_status': '[].kyc_status',
    '[].domain_name': '[].domain_id',
    '[].plutx_userid_id': '[].plutx_userid_id?',
    '[].membership_type_id': '[].membership_type_id?',
    '[].last_name': '[].last_name',
    '[].first_name': '[].first_name',
    '[].points': '[].points'
  },
  single: {
    id: 'id',
    email: 'email',
    name: 'name',
    phone: 'phone',
    twofa_enable_flg: 'twofa_enable_flg',
    twofa_download_key_flg: 'twofa_download_key_flg',
    created_at: 'created_at',
    member_sts: 'member_sts',
    fullname: 'fullname',
    phone: 'phone',
    date_of_birth: 'date_of_birth',
    address: 'address',
    city: 'city',
    post_code: 'post_code',
    country: 'country',
    referral_code: 'referral_code',
    referrer_code: 'referrer_code',
    infinito_id: 'infinito_id',
    latest_login_at: 'latest_login_at',
    kyc_id: 'kyc_id',
    kyc_level: 'kyc_level',
    kyc_status: 'kyc_status',
    domain_name: 'domain_name',
    plutx_userid_id: 'plutx_userid_id?',
    membership_type_id: 'membership_type_id?',
    first_name: 'first_name',
    last_name: 'last_name',
    current_language: 'current_language',
    referral_link: 'referral_link',
    membership_type_name: 'membership_type_name',
    points: 'points'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 