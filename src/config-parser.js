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
function shlex_split(line) {
  return line.match(/"([^"]+)"/);
}

/**
 *
 */
function ConfigBuilder() {
  var config = {
    ACL: {},
    User: {}
  }

  this.Port = function(port) {
    config.Port = _.parseInt(port);
  };
  this.MaxUsers = function(maxUsers) {
    config.MaxUsers = _.parseInt(maxUsers);
  };
  this.MaxChannels = function(maxUserChannels, maxAnonChannels) {
    // XXX: Hits parseInt/map strange behavior
    // parseInt takes two argument map given a pair of element and the index.
    config.MaxChannels = _.map([maxUserChannels, maxAnonChannels], Number);
  };
  this.DefaultTopic = function(defaultTopic) {
    config.DefaultTopic = defaultTopic;
  };
  this.DefaultBPM = function(defaultBpm) {
    config.DefaultBPM = _.parseInt(defaultBpm);
  };
  this.DefaultBPI = function(defaultBpi) {
    config.DefaultBPI = _.parseInt(defaultBpi);
  };
  this.ServerLicense = function(serverLicense) {
    config.ServerLicense = serverLicense;
  };
  this.AnonymousUsers = function(anonymousUsers) {
    config.AnonymousUsers = parseBoolean(anonymousUsers);
  };
  this.AnonymousUsersCanChat = function(anonymousUsersCanChat) {
    config.AnonymousUsersCanChat = parseBoolean(anonymousUsersCanChat);
  };
  this.AnonymousMaskIP = function(anonymousMaskIP) {
    config.AnonymousMaskIP = parseBoolean(anonymousMaskIP);
  };
  this.AllowHiddenUsers = function(allowHiddenUsers) {
    config.AllowHiddenUsers = parseBoolean(allowHiddenUsers);
  };
  this.ACL = function(mask, access) {
    config.ACL[mask] = access;
  };
  this.User = function(name, pass, perm) {
    perm = (perm === undefined) ? '*' : perm;
    config.User[name] = {pass: pass, perm: perm};
  };
  this.SetVotingThreshold = function(setVotingThreshold) {
    config.SetVotingThreshold = _.parseInt(setVotingThreshold);
  };
  this.SetVotingVoteTimeout = function(setVotingVoteTimeout) {
    config.SetVotingVoteTimeout = _.parseInt(setVotingVoteTimeout);
  };

  this.getResult = function() {
    return config;
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
  var is_comment = function(line) { return !!(line.lastIndexOf('#', 0) === 0); };
  var is_not_comment = function(line) { return !is_comment(line); };

  stream.on('error', function onStreamError(err) {
    done(err, null);
  })

  reader.on('line', function onReadLine(line) {
    lineno += 1;

    if (line === '' || is_comment(line)) {
      return;
    }

    var xs = _.head(line.split(/\s+/), is_not_comment);
    var key = _.first(xs);
    var value = null;

    switch (key) {
    case 'DefaultTopic':
      // Ad-hoc quoted string handling
      value = [shlex_split(line)[1]];
      break;
    default:
      value = _.rest(xs);
      break;
    }

    var method = builder[key];
    console.log(key)
    if (_.isFunction(method) && value !== null) {
      method.apply(builder, value);
    } else {
      error = format("Unknown key %s at line: %d", key, lineno);
      stream.close();
    }
  });

  stream.once('end', function() {
    done(error, builder.getResult());
  });
}

exports.ConfigBuilder = ConfigBuilder;
exports.loadConfig = loadConfig;
