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

Filter.prototype.before = function (serverId, msg, opts, next) {
  opts.__statsd__ = {
    startTime: Date.now()
  }
  next()
}

Filter.prototype.after = function (serverId, msg, opts, next) {
  const duration = Date.now() - opts.__statsd__.startTime
  const tags = {
    route: msg.serverType + '.' + msg.service + '.' + msg.method,
  }

  this.client.histogram('pomelo.rpc.response_time', duration, tags)
  next()
}
