
'use strict';

var net = require('net');
var assert = require('assert');
var format = require('util').format;
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var NetMessageParser = require('./parser');
var NetMessage = require('./message');
_.extend(global, require('./consts'));

/**
 * @private
 */
function formatAddress(host, port) {
  assert.ok(port > 0);
  return format('%s:%d', host, port);
}
// var formatAddress = _.partial(format, '%s:%d');
// var formatAddress = format.bind(null, '%s:%d');

/**
 * @public
 */
function startServer(ev, config) {
  assert.ok(config.port !== undefined);
  assert.ok(_.isNumber(config.port) && config.port > 0);

  var server = net.createServer(function onServerConnect(conn) {
    var address = formatAddress(conn.remoteAddress, conn.remotePort);
    var parser = new NetMessageParser();

    parser.on('message', function onParserMessage(type, payload) {
      ev.emit('message', type, payload);

      switch (type) {
      case SERVER_AUTH_CHALLENGE:
        console.log(NetMessage.parseAuthChallenge(payload));
        break;
      case KEEP_ALIVE:
        break;
      }
    });

    ev.emit('client-connected', address);

    conn.on('end', function onConnectionEnd() {
      ev.emit('client-disconnected', address);
    });

    conn.pipe(parser);

    // TODO: keep-alive timer
  });

  server.on('error', function onServerError(err) {
    ev.emit('server-error', err);
  });

  server.listen(config.port, function onServerListen() {
    ev.emit('server-start', formatAddress(config.host, config.port));
  });

  // TODO: server-stop

  return server;
}

/**
 * @public
 */
function main() {
  // TODO: parse command line arguments
  // TODO: start server

  var ev = new EventEmitter();

  ev.once('server-start', function onServerStart(addr) {
    console.log('server-start', addr);
  });

  ev.on('server-error', function onServerError(err) {
    console.error('server-error', err);
  });

  ev.on('client-connected', function onClientConnected(addr) {
    console.log('client-connected', addr);
  });

  ev.on('client-disconnected', function onClientDisConnected(addr) {
    console.log('client-disconnected', addr);
  });

  ev.on('message', function onMessage(type, payload) {
    console.log(type, payload);
  });

  startServer(ev, {port: 2049, host: 'localhost'});
}

if (require.main === module) {
  main(process.argv.slice(2));
}
