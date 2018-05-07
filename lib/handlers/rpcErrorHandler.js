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
        let error = true
        let status = err.code || 'GEN-00'
        let type = "rpc"
        let route = `${msg.__route__}`

        const tags = {
          route: route,
          type: 'rpc',
          error: error,
          status: status
        }
        
        statsd.increment('pomelo.error', tags)
        currentRPCErrorHandler(err, msg, resp, session, next)
    };

    return rpcErrorWrapper;
}
