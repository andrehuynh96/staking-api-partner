const logger = require('app/lib/logger');
const config = require('app/config');
const mailer = require('app/lib/mailer');
const Member = require('app/model/wallet').members;
const Joi = require("joi");
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;


module.exports = {
  invite: async (req, res, next) => {
    try {
      let {body: { emails }, user: {id} } = req;
      let member = await Member.findOne({
        where: {
          deleted_flg: false,
          id: id 
        }
      })
      if (!member) {
        return res.badRequest(res.__('MEMBER_NOT_FOUND'), 'MEMBER_NOT_FOUND');
      }
      if (!member.referral_code) {
        return res.badRequest(res.__('REFERRAL_CODE_NOT_FOUND'), 'REFERRAL_CODE_NOT_FOUND');
      }
      if (!emails) {
        return res.badRequest("Missing parameters", "emails")
      } else {
        for (email of emails.split(',')) {
          let result = Joi.validate(email.trim(), 
            Joi.string().email({
              minDomainAtoms: 2
            }));
          if (result.error) {
            console.log(result.error);
            return res.badRequest(res.__('EMAIL_INCORRECT'), 'EMAIL_INCORRECT');
          }
        }
      }
      _sendEmailReferral(member, member.fullname, member.email, emails, member.referral_code);
      return res.ok(true);
  } catch (error) {
      logger.error(error);
      next(error);
  }
}

}

async function _sendEmailReferral(member, memberName, memberEmail, emails, referralCode) {
  try {
    let templateName = EmailTemplateType.REFERRAL 
    let template = await EmailTemplate.findOne({
      where: {
        name: templateName,
        language: member.current_language
      }
    })

    if(!template){
      template = await EmailTemplate.findOne({
        where: {
          name: templateName,
          language: 'en'
        }
      })
    }

    if(!template)
      return res.notFound(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ["id"] });
  
    let subject =`${config.emailTemplate.partnerName} - ${template.subject}`;
    let from = `${config.emailTemplate.partnerName} <${config.smtp.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.membership.referralUrl}${referralCode}`,
      referralCode: referralCode,
      name: memberName,
      email: memberEmail
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithDBTemplate(subject, from, emails, data, template.template);
  } catch (err) {
    logger.error("send confirmed email for changing reward address for master pool fail", err);
  }
}