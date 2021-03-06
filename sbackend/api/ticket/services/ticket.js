'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find (params) {
    const {city, _limit} = params
    return strapi.query('ticket').model.find({'city': city}).limit(parseInt(_limit)).sort({'createdAt':'desc'})
    .populate({
      path: 'client tickettype assiganted',
      populate: {
        path: 'neighborhood technology'
      }
    })
  }
};
