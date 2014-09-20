
'use strict';

var crypto = require('crypto');
var assert = require('assert').ok;
var SmartBuffer = require('smart-buffer');


exports.createAuthPasswordHash =
    function createAuthPasswordHash(challenge, username, password, anonymous) {
  assert(challenge !== null && challenge.length === 8);
  assert(username !== null);
  assert(password !== null);

  var hashA = crypto.createHash('sha1');
  if (anonymous) {
    hashA.update('anonymous:');
  }
  hashA.update(username + ':' + password);

  var hashB = crypto.createHash('sha1');
  hashB.update(hashA.digest());
  hashB.update(challenge);

  return hashB.digest();
};


exports.parseAuthChallenge =
function parseAuthChallenge(stream) {
  return {
    challenge: stream.readBuffer(/* length: */ 8),
    serverCaps: stream.readUInt32LE(),
    protocolVersion: stream.readUInt32LE(),
    licenseAgreement: stream.readStringNT()
  };
};


exports.buildAuthChallenge =
function buildAuthChallenge(challenge, serverCaps, protocolVersion, licenseAgreement) {
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
};
