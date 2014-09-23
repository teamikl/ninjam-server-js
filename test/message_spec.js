
var SmartBuffer = require('smart-buffer');

_.assign(global, require('../src/message'));

describe('message.js', function(){
  describe('AuthChallenge', function(){
    it('createAuthPasswordHash', function(){
      var u = createAuthPasswordHash('xxxxxxxx', 'anon', '', true);
      var v = new Buffer('b2262d7bf17b2b7c449ba0ee8cd213e96c788755', 'hex');

      expect(u.length).to.equal(v.length);
      expect(u.toString()).to.equal(v.toString());
    });

    it('build', function(){
      var licenseAgreement = 'license text';
      var v = buildAuthChallenge(
        new Buffer('xxxxxxxx'),
        1,
        0x00020000,
        licenseAgreement);

      expect(v.length).to.equal(8+4+4+licenseAgreement.length+1);
    });

    it('parse', function(){
      var v = buildAuthChallenge(
        new Buffer('xxxxxxxx'),
        1, 0x00020000, 'license text');
      var u = parseAuthChallenge(new SmartBuffer(v));

      expect(u.licenseAgreement).to.equal('license text');
    });
  });

  describe('AuthReply', function(){
    it('build', function(){
      var name = 'anon@127.0.0.x';
      var v = buildAuthReply(0, name, 2);

      expect(v.length).to.equal(1+name.length+1+1);
    });

    it('parse', function(){
      var v = buildAuthReply(0, 'message', 2);
      var u = parseAuthReply(new SmartBuffer(v));

      expect(u.flag).to.equal(0);
      expect(u.message).to.equal('message');
      expect(u.maxChannels).to.equal(2);
    });
  });

  describe('ConfigChangeNotify', function(){

  });

  describe('UserInfoChangeNotify', function(){

  });

  describe('DownloadIntervalBegin', function(){

  });

  describe('DownloadIntervalWrite', function(){

  });

  describe('AuthUser', function(){

  });

  describe('SetUserMask', function(){

  });

  describe('SetChannel', function(){

  });

  describe('UploadIntervalBegin', function(){

  });

  describe('UploadIntervalWrite', function(){

  });

  describe('ChatMessage', function(){

  });
});
