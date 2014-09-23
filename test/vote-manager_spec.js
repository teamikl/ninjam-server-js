'use strict';

var VoteManager = require('../src/vote-manager');

describe('vote manager', function() {
  it('emits passed event when vote over threshold', function(done) {
    this.timeout(10*1000/* ms */);

    var options = {total: 4, timeout: 60/* seconds */, threshold: 50};
    var manager = VoteManager(
      options.timeout, options.threshold, options.total);

    manager.on('passed', function() {
      done();
    });
    manager.emit('update-total', 4);
    manager.emit('vote', 'userA');
    manager.emit('vote', 'userB');
  });
});
