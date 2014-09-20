// Copyright (C) Ikkei Shimomura (tea) <Ikkei.Shimura@gmail.com>

var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Base class for EventListener in Server/Client
 * Use example, ChatEventListener, AudioEventListener, VideoEventListener
 */

function EventListener(ev) {
  'use strict';

  if (!(this instanceof EventListener)) {
    return new EventListener(ev);
  }
  EventEmitter.call(this);

  this._initialize(ev);
}
util.inherits(EventListener, EventEmitter);

module.exports = EventListener;
