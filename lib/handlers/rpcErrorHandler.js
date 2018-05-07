// pomelo dogstatsd
// https://github.com/topfreegames/pomelo-dogstatsd
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2018 Top Free Games <backend@tfgco.com>

module.exports = function (app, statsd) {
  const errorHandlerParam = 'rpcErrorHandler'

  currentRPCErrorHandler = app.get(errorHandlerParam)
  rpcErrorWrapper = function (err, msg, resp, session, next) {
    try {
      let status = err.code || 'GEN-00'
      let route = msg.__route__

      const tags = {
        route: route,
        type: 'rpc',
        error: true,
        status: status
      }

      statsd.increment('pomelo.error', tags)
    } finally {
      currentRPCErrorHandler(err, msg, resp, session, next)
    }
  };

  return rpcErrorWrapper;
}
