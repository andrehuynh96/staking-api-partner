const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const moment = require('moment');
const MemberStatus = require('app/model/wallet/value-object/member-status');

module.exports = {
  update: async (req, res, next) => {
    try {
      const { body, params } = req;
      let value = {};
      let member = await Member.findOne({
        where: {
          id: params.id
        }
      });
      if (!member) {
        return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
      }

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
        returning: true,
        plain: true
      });
      if (!response) {
        res.serverInternalError();
      }
      return res.ok(true);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  activeAccount: async (req, res, next) => {
    try {
      const { params } = req;
      const member = await Member.findOne({
        where: {
          id: params.id
        }
      });
      if (!member) {
        return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
      }
      const [_, response] = await Member.update({
        member_sts: MemberStatus.ACTIVATED
      }, {
        where: {
          id: params.id
        },
        returning: true,
        plain: true
      });
      if (!response) {
        res.serverInternalError();
      }
      return res.ok(true);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
};