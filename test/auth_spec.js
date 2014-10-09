
var util = require('util');
var Auth = require('../src/auth');


/**
 * @private
 * @description authenticate who username equals to password
 *
 * Real tests should be test in E2E
 */
function JohnAuth() {
  if (!(this instanceof JohnAuth))
    return new JohnAuth();

  this.username = null;
  this.password = null;

  Auth.call(this);
}
util.inherits(JohnAuth, Auth);

JohnAuth.prototype.initialize = function initialzie(username, password) {
  this.username = username;
  this.password = password;
};

JohnAuth.prototype.authenticate = function(callback) {
  callback(this.username === this.password ? null : 'username/password mismatch');
};


describe('auth.js', function(){
  describe('on memory key-value store user look up', function(){
    it('emit commit', function (done){
      var auth = new JohnAuth();
      auth.initialize("test", "test");
      auth.once('commit', function(){
        done();
      });
      auth.once('abort', function(reason){
        done(reason);
      });
      auth.login();
    });

    it('emit abort event by timeout', function (done){
      var auth = new JohnAuth();
      auth.initialize("test", "test");
      auth.once('commit', function(){
        done('commit should not be triggered in this test')
      });
      auth.once('abort', function(reason){
        done();
      });
      /* mock busy auth for test timeout */
      auth.authenticate = function(cb){
        setTimeout(function(){
          /* this will trigger commit event */
          cb(null);
        }, 50 /* ms */);
      }
      auth.login(/* timeout: */ 20 /* ms */);
    });
  });
});
