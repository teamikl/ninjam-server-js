'use strict';

var crypto = require('crypto');
var assert = require('assert').ok;
var SmartBuffer = require('smart-buffer');

/**
 *
 */
function messageTranslateMixin(type, payload) {
  switch (type) {
  case SERVER_AUTH_CHALLENGE:
    break;
  case SERVER_AUTH_REPLY:
    break;
  case SERVER_CONFIG_CHANGE_NOTIFY:
    break;
  case SERVER_USERINFO_CHANGE_NOTIFY:
    break;
  case SERVER_DOWNLOAD_INTERVAL_BEGIN:
    break;
  case SERVER_DOWNLOAD_INTERVAL_WRITE:
    break;
  case CLIENT_AUTH_USER:
    break;
  case CLIENT_SET_USER_MASK:
    break;
  case CLIENT_SET_CHANNEL:
    break;
  case CLIENT_UPLOAD_INTERVAL_BEGIN:
    break;
  case CLIENT_UPLOAD_INTERVAL_WRITE:
    break;
  case CHAT_MESSAGE:
    // TODO: delegate to chat module
    break;
  case KEEP_ALIVE:
    // TODO: update keep-alive expire time
    // this.emit('keep-alive');
    break;
  }
}
exports.messageTranslateMixin = messageTranslateMixin;

function createAuthPasswordHash(challenge, username, password, anonymous) {
  assert(challenge !== null && challenge.length === 8);
  assert(username !== null);
  assert(password !== null);

  var hashA = crypto.createHash('sha1');
  if (!!anonymous) {
    hashA.update('anonymous:');
  }
  hashA.update(username + ':' + password);

  var hashB = crypto.createHash('sha1');
  hashB.update(hashA.digest());
  hashB.update(challenge);

  return hashB.digest();
}
exports.createAuthPasswordHash = createAuthPasswordHash;

function parseAuthChallenge(stream) {
  return {
    challenge: stream.readBuffer(/* length: */ 8),
    serverCaps: stream.readUInt32LE(),
    protocolVersion: stream.readUInt32LE(),
    licenseAgreement: stream.readStringNT()
  };
}
exports.parseAuthChallenge = parseAuthChallenge;

function buildAuthChallenge(challenge, serverCaps,
  protocolVersion, licenseAgreement) {
  assert(challenge.length === 8);

  var hasLicense = !!licenseAgreement;

  // Set the low bit for has-license flag.
  serverCaps = (hasLicense) ? (serverCaps | 1)
                            : (serverCaps & ~1);

  var buffer = new SmartBuffer();
  buffer.writeBuffer(challenge, /* offset: */ 0);
  buffer.writeUInt32LE(serverCaps);
  buffer.writeUInt32LE(protocolVersion);
  if (hasLicense) {
    buffer.writeStringNT(licenseAgreement);
  }

  return buffer.toBuffer();
}
exports.buildAuthChallenge = buildAuthChallenge;

exports.buildAuthReply =
function buildAuthReply(flag, message, maxChannels) {
  assert(0xff >= flag && flag >= 0x00);

  var buffer = new SmartBuffer();
  buffer.writeUInt8(flag);
  buffer.writeStringNT(message);
  buffer.writeUInt8(maxChannels);
  return buffer.toBuffer();
};

exports.parseAuthReply =
function parseAuthReply(stream) {
  return {
    flag: stream.readUInt8(),
    message: stream.readStringNT(),
    maxChannels: stream.readUInt8()
  };
};
