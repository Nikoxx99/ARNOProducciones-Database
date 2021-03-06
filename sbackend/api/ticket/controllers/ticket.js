'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');
const { simpleTelegramCreateTicket } = require('../../../mikrotik/functions');

module.exports = {
  async create(ctx) {
    let entity;
    entity = await strapi.services.ticket.create(ctx.request.body);
    const neighborhood = await strapi.services.neighborhood.findOne({ id: entity.client.neighborhood })
    const telegrambot = await strapi.services.telegrambot.find({city: entity.city.id})
    simpleTelegramCreateTicket(entity, neighborhood.name, telegrambot[0])
    return sanitizeEntity(entity, { model: strapi.models.ticket });
  },
  async find(ctx) {
    let entities;
    let client;
    if (ctx.query.client) {
      client = ctx.query.client
      entities = await strapi.services.ticket.search({'client': client});
    } else {
      entities = await strapi.services.ticket.find(ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.ticket }));
  },
}