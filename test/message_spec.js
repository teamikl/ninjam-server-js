
var SmartBuffer = require('smart-buffer');

_.assign(global, require('../src/message'));

suite('message.js', function(){
  suite('AuthChallenge', function(){
    test('createAuthPasswordHash', function(){
      var u = createAuthPasswordHash('xxxxxxxx', 'anon', '', true);
      var v = new Buffer('b2262d7bf17b2b7c449ba0ee8cd213e96c788755', 'hex');

      expect(u.length).to.equal(v.length);
      expect(u.toString()).to.equal(v.toString());
    });

    test('build', function(){
      var licenseAgreement = 'license text';
      var v = buildAuthChallenge(
        new Buffer('xxxxxxxx'),
        1,
        0x00020000,
        licenseAgreement);

      expect(v.length).to.equal(8+4+4+licenseAgreement.length+1);
    });

    test('parse', function(){
      var v = buildAuthChallenge(
        new Buffer('xxxxxxxx'),
        1, 0x00020000, 'license text');
      var u = parseAuthChallenge(new SmartBuffer(v));

      expect(u.licenseAgreement).to.equal('license text');
    });
  });

  suite('AuthReply', function(){
    test('build', function(){
      var name = 'anon@127.0.0.x';
      var v = buildAuthReply(0, name, 2);

      expect(v.length).to.equal(1+name.length+1+1);
    });

    test('parse');
  });

  suite('ConfigChangeNotify', function(){

  });

  suite('UserInfoChangeNotify', function(){

  });

  suite('DownloadIntervalBegin', function(){

  });

  suite('DownloadIntervalWrite', function(){

  });

  suite('AuthUser', function(){

  });

  suite('SetUserMask', function(){

  });

  suite('SetChannel', function(){

  });

  suite('UploadIntervalBegin', function(){

  });

  suite('UploadIntervalWrite', function(){

  });

  suite('ChatMessage', function(){

  });
});
