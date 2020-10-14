const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const moment = require('moment');

module.exports = {
  update: async (req, res, next) => {
    try {
      const { body, params } = req;
      let value = {};
      if (body.fullname) {
        value.fullname = body.fullname;
      }
      if (body.first_name) {
        value.first_name = body.first_name;
      }
      if (body.last_name) {
        value.last_name = body.last_name;
      }
      if (body.phone) {
        value.phone = body.phone;
      }
      if (body.date_of_birth) {
        value.date_of_birth = moment(body.date_of_birth).toDate();
      }
      if (body.address) {
        value.address = body.address;
      }
      if (body.city) {
        value.city = body.city;
      }
      if (body.post_code) {
        value.post_code = body.post_code;
      }
      if (body.country) {
        value.country = body.country;
      }

      let [_, response] = await Member.update(value, {
        where: {
          id: params.id
        },
        returning: true
      });
      if (!response || response.length == 0) {
        res.notFound('Not Found');
      }
      return res.ok(true);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
};