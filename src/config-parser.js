/**
 * Parse and Build server config from traditional server config.
 *
 * This module exists as sample of implement config builder.
 *
 * There is a limitation, can not parse quoted strings perfectly.
 * So it is not allowed to use double-quote character in topic text.
 * This won't be fixed, for maintenance cost reason. use JSON config.
 *
 * NOTE: This module will be an obsolute module after v1.0
 */

'use strict';

// TODO: lineno for parse error
// TODO: selectable safe parse or raise error

var fs = require('fs');
var format = require('util').format;
var readline = require('readline');
var _ = require('lodash');

/**
 * @private
 */
function parseBoolean(x) {
  return (x === 'yes') ? true : (x === 'no') ? false : null;
}

/**
 * @private
 */
function shlexSplit(line) {
  return line.match(/"([^"]+)"/);
}

/**
 *
 */
function ConfigBuilder() {
  var config = {
    ACL: {},
    User: {}
  };

  return {
    Port: function setPort(port) {
      config.Port = _.parseInt(port);
    },
    MaxUsers: function setMaxUsers(maxUsers) {
      config.MaxUsers = _.parseInt(maxUsers);
    },
    MaxChannels: function setMaxChannels(maxUserChannels, maxAnonChannels) {
      // XXX: Hits parseInt/map strange behavior
      // parseInt takes two arguments map given element and the index.
      config.MaxChannels = _.map([maxUserChannels, maxAnonChannels], Number);
    },
    DefaultTopic: function setDefaultTopic(defaultTopic) {
      config.DefaultTopic = defaultTopic;
    },
    DefaultBPM: function setDefaultBPM(defaultBpm) {
      config.DefaultBPM = _.parseInt(defaultBpm);
    },
    DefaultBPI: function setDefaultBPI(defaultBpi) {
      config.DefaultBPI = _.parseInt(defaultBpi);
    },
    ServerLicense: function setServerLicense(serverLicense) {
      config.ServerLicense = serverLicense;
    },
    AnonymousUsers: function setAnonymousUsers(anonymousUsers) {
      config.AnonymousUsers = parseBoolean(anonymousUsers);
    },
    AnonymousUsersCanChat: function setAnonymousUsersCanChat(canChat) {
      config.AnonymousUsersCanChat = parseBoolean(canChat);
    },
    AnonymousMaskIP: function setAnonymousMaskIP(maskIP) {
      config.AnonymousMaskIP = parseBoolean(maskIP);
    },
    AllowHiddenUsers: function setAllowHiddenUsers(allowHiddenUsers) {
      config.AllowHiddenUsers = parseBoolean(allowHiddenUsers);
    },
    ACL: function addACL(mask, access) {
      config.ACL[mask] = access;
    },
    User: function addUser(name, pass, perm) {
      perm = (perm === undefined) ? '*' : perm;
      config.User[name] = {pass: pass, perm: perm};
    },
    SetVotingThreshold: function setSetVotingThreshold(votingThreshold) {
      config.SetVotingThreshold = _.parseInt(votingThreshold);
    },
    SetVotingVoteTimeout: function setSetVotingVoteTimeout(voteTimeout) {
      config.SetVotingVoteTimeout = _.parseInt(voteTimeout);
    },
    getResult: function getResult() {
      return config;
    }
  };
}

/**
 * @public
 */
function loadConfig(filePath, done) {
  var builder = new ConfigBuilder();
  var stream = fs.createReadStream(filePath);
  var reader = readline.createInterface(stream, {});
  var lineno = 0;
  var error = null;
  var isComment = function(line) { return (line.lastIndexOf('#', 0) === 0); };
  var isNotComment = function(line) { return !isComment(line); };

  stream.on('error', function onStreamError(err) {
    done(err, null);
  });

  reader.on('line', function onReadLine(line) {
    lineno += 1;

    if (line === '' || isComment(line)) {
      return;
    }

    var xs = _.head(line.split(/\s+/), isNotComment);
    var key = _.first(xs);
    var value = null;

    switch (key) {
    case 'DefaultTopic':
      // Ad-hoc quoted string handling
      value = [shlexSplit(line)[1]];
      break;
    default:
      value = _.rest(xs);
      break;
    }

    var method = builder[key];
    if (_.isFunction(method) && value !== null) {
      method.apply(builder, value);
    } else {
      error = format('Unknown key %s at line: %d', key, lineno);
      stream.close();
    }
  });

  stream.once('end', function() {
    done(error, builder.getResult());
  });
}

exports.ConfigBuilder = ConfigBuilder;
exports.loadConfig = loadConfig;
