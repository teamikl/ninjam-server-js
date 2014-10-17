'use strict';

var KeepAliveTimer = require('../src/keep-alive');

describe('keep-alive', function() {
  it('should have a property interval', function() {
    var keepAlive = new KeepAliveTimer(3 /* seconds */);
    expect(keepAlive).to.have.property('interval');
    expect(keepAlive.interval).to.equal(3);
  });

  it('should have a property timer', function() {
    var keepAlive = new KeepAliveTimer(3 /* seconds */);
    expect(keepAlive).to.have.property('timer');
    expect(keepAlive.timer).to.equal(null);
  });

  it('should be KeepAliveTimer instance', function() {
    expect(KeepAliveTimer(3)).to.be.an.instanceOf(KeepAliveTimer);
  });

  it('should fail negative interval value', function() {
    expect(function with_zero() {
      new KeepAliveTimer(0);
    }).to.throw(/interval must be positive number/);

    expect(function with_minus_one() {
      new KeepAliveTimer(-1);
    }).to.throw(/interval must be positive number/);
  });

  it('should not fail too min interval value', function() {
    expect(function with_one() {
      new KeepAliveTimer(1);
    }).to.not.throw(/interval must be greater or equal than/);
  });

  it('should emit ping within interval timeout', function(done){
    this.timeout(3 * 1000 /* ms */);
    var keepAlive = new KeepAliveTimer(0.01 /* seconds */);
    keepAlive.once('ping', function onPing(){
      done();
      keepAlive.stop();
      expect(keepAlive.timer).to.equal(null);
    });
    keepAlive.start();
  });

  it('should emit expired event', function(done) {
    this.timeout(3 * 1000 /* ms */)
    var keepAlive = new KeepAliveTimer(0.02 /* seconds */);
    keepAlive.once('expired', function onExpired(){
      done();
      keepAlive.stop();
      expect(keepAlive.timer).to.equal(null);
    });
    keepAlive.start();
  });
});
