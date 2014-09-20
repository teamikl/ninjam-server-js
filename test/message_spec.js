
_.assign(global, require('../src/message'));

describe('./src/message', function(){
  it('createAuthPasswordHash', function(){
    var u = createAuthPasswordHash('xxxxxxxx', 'anon', '', true);
    var v = new Buffer('b2262d7bf17b2b7c449ba0ee8cd213e96c788755', 'hex');

    expect(v.length).to.equal(u.length);
    expect(v.toString()).to.equal(u.toString());
  });

  it('parseAuthChallenge');
  it('buildAuthChallenge');

  it('parseAuthReply');
  it('buildAuthReplye');

  it('parseConfigChangeNotify');
  it('buildConfigChangeNotify');

  it('parseUserInfoChangeNotify');
  it('buildUserInfoChangeNotify');

  it('parseDownloadIntervalBegin');
  it('buildDownloadIntervalBegin');

  it('parseDownloadIntervalWrite');
  it('buildDownloadIntervalWrite');

  it('parseAuthUser');
  it('buildAuthUser');

  it('parseSetUserMask');
  it('buildSetUserMask');
  it('parseSetChannel');
  it('buildSetChannel');

  it('parseUploadIntervalBegin');
  it('buildUploadIntervalBegin');

  it('parseUploadIntervalWrite');
  it('buildUploadIntervalWrite');

  it('parseChatMessage');
  it('buildChatMessage');
});
