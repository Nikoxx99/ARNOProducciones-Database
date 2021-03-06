'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { simpleTelegramPasswordChange } = require('../../../mikrotik/functions');
module.exports = {
  async TestPasswordChange(ctx) {
    const entity = await strapi.services.passwordchange.findOne({ dni: ctx.query._dni, _sort:"createdAt:desc" })
    if (entity) {
      if (entity.closed.value === false) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  },
  async updatePasswordChangeRequest(ctx) {
    const id = ctx.request.body.input._id
    const payload = ctx.request.body.input
    const newPassword = ctx.request.body.input.password
    const clientid = ctx.request.body.input.clientid
    if (clientid) {
      await strapi.services.client.update({'id': clientid}, {'wifi_password': newPassword})
    }
    await strapi.services.passwordchange.update({ id }, payload);
    return true
  },
  async createPasswordChangeRequest(ctx) {
    const payload = ctx.request.body.input
    const dni = payload.dni
    const entity = await strapi.services.client.findOne({ dni: dni });
    const telegrambot = await strapi.services.telegrambot.find({'name': 'Notificador'})
    if (!entity) {
      simpleTelegramPasswordChange({name: 'NO REGISTRA', code: 'NO REGISTRA'}, telegrambot[0])
      await strapi.services.passwordchange.create(payload);
      return true
    } else {
      simpleTelegramPasswordChange(entity, telegrambot[0])
      const client = entity._id
      await strapi.services.passwordchange.create({ client, ...payload });
      return true
    }
  }
};
