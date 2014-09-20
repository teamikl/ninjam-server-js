// Copyright (C) Ikkei Shimomura (tea) <Ikkei.Shimura@gmail.com>

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');


function VoteManager(timeout, threshold, total) {
  'use strict';

  if (!(this instanceof VoteManager)) {
    return new VoteManager(timeout, threshold, total);
  }
  EventEmitter.call(this);

  var self = this;
  this.timeout = (timeout) ? timeout : 60; /* seconds */
  this.threshold = (threshold) ? threshold : 50; /* fifty percents */
  this.total = (total) ? total : 0;
  this.expire = null;
  this.assentors = {};

  this.on('update-total', function updateTotal(total){
    self.total = total;
  });

  this.on('vote', this.vote);
}
util.inherits(VoteManager, EventEmitter);

// private: current time in mili-seconds.
function getCurrentTime() {
  'use strict';
  return new Date.getTime();
}

/**
 * process vote, this takes three stages Start/Vote/Pass.
 */
VoteManager.prototype.vote = function vote(user, now_) {
  'use strict';

  // given as argument in unit test
  var now = (now_) ? now_ : getCurrentTime();

  // Started
  if (this.expire !== null) {
    this.expire = now + this.timeout * 1000; /* ms */
    this.emit('started', user, now);
  }

  // Voted
  if (this.expire > now) {
    // TODO: if user was already voted?
    this.assentors[user] = now;
    this.emit('voted', user, now);
  }

  // Passed
  if (_.keys(this.assentors).length / this.total * 100 >= this.threshold) {
    this.reset();
    this.emit('passed');
  }
};

VoteManager.prototype.reset = function reset() {
  'use strict';

  this.expire = null;
  this.assentors = {};
};

module.exports = VoteManager;
