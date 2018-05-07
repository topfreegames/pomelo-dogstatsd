// pomelo dogstatsd
// https://github.com/topfreegames/pomelo-dogstatsd
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2018 Top Free Games <backend@tfgco.com>

module.exports = function (app, statsd) {
  const errorHandlerParam = 'rpcErrorHandler'

  currentRPCErrorHandler = app.get(errorHandlerParam)
  rpcErrorWrapper = function (err, serverId, msg, opts) {
    try {
      const tags = {
        route: msg.serverType + '.' + msg.service + '.' + msg.method,
        type: 'rpc',
        error: true
      }

      statsd.increment('pomelo.error', tags)
    } finally {
      if (currentRPCErrorHandler) {
        currentRPCErrorHandler(err, serverId, msg, opts)
      }
    }
  };

  return rpcErrorWrapper;
}
