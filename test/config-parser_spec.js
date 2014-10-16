
var configParser = require('../src/config-parser');
var ConfigBuilder = configParser.ConfigBuilder;
var loadConfig = configParser.loadConfig;

var fixtures = {
  'example.cfg': './test/fixtures/example.cfg',
  'invalid.cfg': './test/fixtures/invalid.cfg',
};

describe('config-parser.js', function() {
  describe('ConfigBuilder', function() {
    it('should return bare config dictionary', function() {
      var builder = new ConfigBuilder();
      var config = builder.getResult();

      expect(config).to.have.property('ACL');
      expect(config).to.have.property('User');
       expect(config.ACL).to.be.empty;
       expect(config.User).to.be.empty;
      expect(_.keys(config)).to.have.length(2);
    });
  });

  describe('loadConfig', function() {
    it('load example.cfg', function(done) {
      loadConfig(fixtures['example.cfg'], function loaded(err, config) {
        expect(err).to.be.null;
        expect(config).to.be.an('object');

        expect(config).to.have.property('Port');
        expect(config.Port).to.equal(2049);

        done();
      });
    });

    it('load file not found', function(done) {
      loadConfig('this_path_does_not_exists.cfg', function loaded(err, config) {
        expect(err).not.to.be.null;
        expect(err).to.have.property('errno');
        expect(err).to.have.property('code');
        expect(err).to.have.property('path');
        expect(err.errno).to.equal(34); // XXX: what this value?
        expect(err.code).to.equal('ENOENT');
        done();
      });
    });

    it('load invalid.cfg', function(done) {
      loadConfig(fixtures['invalid.cfg'], function loaded(err, config) {
        expect(err).not.to.be.null;
        expect(err).to.match(/^Unknown key (.*) at line: \d+/);
        done();
      });
    });
  });
});
