// pomelo dogstatsd
// https://github.com/topfreegames/pomelo-dogstatsd
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/mit-license
// Copyright © 2018 Top Free Games <backend@tfgco.com>

const filters = require('../filters')
const handlers = require('../handlers')
const StatsD = require('hot-shots')
const os = require("os")

module.exports = function (app, opts) {
  return new Component(app, opts)
}

Component.prototype.name = '__statsd__'

function Component (app, opts) {
  this.app = app
  this.opts = opts || {}

  const config = {
    host: this.opts.host,
    port: this.opts.port,
    prefix: this.opts.prefix || app.get('name'),
    cacheDns: this.opts.cacheDns,
    mock: this.opts.mock,
    maxBufferSize: this.opts.maxBufferSize,
    bufferFlushInterval: this.opts.bufferFlushInterval,
    globalTags: {
      serverType: app.serverType,
      hostname: os.hostname()
    },
    errorHandler: error => {
      let logger = this.opts.logger || console
      logger.warn('pomelo-dogstatsd failed with error:', error)
    },
  }

  const client = new StatsD(config)

  handlerMonitor = filters.handlerMonitor(client)
  rpcMonitor = filters.rpcMonitor(client)
  rpcErrorHandler = handlers.rpcErrorHandler(app, client)

  app.filter(handlerMonitor)
  app.rpcFilter(rpcMonitor)
  app.set('rpcErrorHandler', rpcErrorHandler)
}
