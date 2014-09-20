
_.assign(global, require('../src/message'));

suite('message.js', function(){
  suite('AuthChallenge', function(){
    test('createAuthPasswordHash', function(){
      var u = createAuthPasswordHash('xxxxxxxx', 'anon', '', true);
      var v = new Buffer('b2262d7bf17b2b7c449ba0ee8cd213e96c788755', 'hex');

      expect(v.length).to.equal(u.length);
      expect(v.toString()).to.equal(u.toString());
    });


    test('build', function(){
      var licenseAgreement = 'license text';
      var v = buildAuthChallenge(
        new Buffer('xxxxxxxx'),
        1,
        0x00020000,
        licenseAgreement);

      expect(8+4+4+licenseAgreement.length+1).to.equal(v.length);
    });
  });

  suite('AuthReply', function(){
    test('build');
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
