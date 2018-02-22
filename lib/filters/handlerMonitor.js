// pomelo statsd
// https://github.com/topfreegames/pomelo-statsd
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2018 Top Free Games <backend@tfgco.com>

module.exports = function (client) {
  return new Filter(client)
}

function Filter (client) {
  this.client = client
}

Filter.prototype.before = function (msg, session, next) {
  msg.__statsd__ = {
    startTime: Date.now()
  }
  next()
}

Filter.prototype.after = function (err, msg, session, resp, next) {
  const duration = Date.now() - msg.__statsd__.startTime
  const tags = {
    route: msg.__route__,
    success: !err,
  }

  this.client.histogram('pomelo.handler.response_time', duration, tags)
  next(err)
}