// Copyright (C) Ikkei Shimomura (tea) <Ikkei.Shimura@gmail.com>

'use strict';

var assert = require('assert').ok;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// XXX: duplicated
function getCurrentTime() {
  return (new Date()).getTime();
}

/**
 * @name KeepAliveTimer
 * @description
 * @param {number} interval
 */
function KeepAliveTimer(interval) {
  if (!(this instanceof KeepAliveTimer)) {
    return new KeepAliveTimer(interval);
  }
  EventEmitter.call(this);

  assert(interval > 0,
    'interval must be positive number');

  // This base class should not check min value, that block test
  this.MIN_INTERVAL = 0;
  assert(interval >= this.MIN_INTERVAL,
    'interval must be greater or equal than MIN_INTERVAL');

  this.timer = null;
  this.interval = interval; /* seconds */

  this.once('startTimer', this.startTimer.bind(this));
  this.once('stopTimer', this.stopTimer.bind(this));
  this.on('pong', this.pong.bind(this));
}
util.inherits(KeepAliveTimer, EventEmitter);

/**
 * @public
 */
KeepAliveTimer.prototype.start = function start() {
  this.emit('startTimer');
};

/**
 * @public
 */
KeepAliveTimer.prototype.stop = function stop() {
  this.emit('stopTimer');
};

/**
 * @private
 */
KeepAliveTimer.prototype.startTimer = function startTimer() {
  var interval = this.interval * 1000; /* ms */

  this.timer = setInterval(function pingIteration() {
    this.emit('ping');

    if (getCurrentTime() > (this.expire + interval)) {
      this.emit('expired');
    }
  }.bind(this), interval /* ms */);

  this.pong(); // initialize expire
};

/**
 * @private
 */
KeepAliveTimer.prototype.stopTimer = function stopTimer() {
  if (this.timer === null) {
    return;
  }
  clearInterval(this.timer);
  this.timer = null;
};

/**
 * @private
 */
KeepAliveTimer.prototype.pong = function pong() {
  this.expire = getCurrentTime();
};

module.exports = KeepAliveTimer;
