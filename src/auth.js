
var EventEmitter = require('events').EventEmitter;
var util = require('util');


// TODO: how to store look-up ?

/**
 *
 */
function Auth() {
  if (!(this instanceof Auth)) return new Auth();

  EventEmitter.call(this);
}
util.inherits(Auth, EventEmitter);


function initialize() {
  // sub-class override
}
Auth.prototype.initialize = initialize;

/**
 * NOTE: this method sould be async. or lose chance to timeout.
 *
 * NOTE: callback(null) ... no error, login() will emit commit event.
 *
 * NOTE: How to write doc fof async callback?
 */
function authenticate(callback) {
  // sub-class implement this
}
Auth.prototype.authenticate = authenticate;

/**
 * @public
 * @description
 */
function login(timeout_, commitCb, abortCb) {
  // TODO: logger login

  var self = this;

  var timeout = (timeout_) ? timeout_ : 2000;

  if (_.isFunction(commitCb))
    this.once('commit', commitCb);

  if (_.isFunction(abortCb))
    this.once('abort', abortCb);

  setTimeout(function(self){
    self.removeAllListeners('commit');
    self.emit('abort', 'login process timeout');
  }, timeout, this);

  // ensure authenticate() is async task
  // or the timeout will not be called.
  process.nextTick(function(){
    self.authenticate(function(err) {
      if (err) {
        self.removeAllListeners('commit');
        self.emit('abort', 'authentication failed');
      }
      else {
        self.removeAllListeners('abort');
        self.emit('commit');
      }
    });
  });
}
Auth.prototype.login = login;


/**
 * logout? we does not have login session or state now.
 * if consume login time, may be need.
 */
function logout() {
  // TODO: logger logout
}
Auth.prototype.logout = logout;


module.exports = Auth;
