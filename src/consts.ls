/*jshint unused:false */

var SERVER_AUTH_CHALLENGE = 0x00;
var SERVER_AUTH_REPLY = 0x01;
var SERVER_CONFIG_CHANGE_NOTIFY = 0x02;
var SERVER_USERINFO_CHANGE_NOTIFY = 0x03;
var SERVER_DOWNLOAD_INTERVAL_BEGIN = 0x04;
var SERVER_DOWNLOAD_INTERVAL_WRITE = 0x05;
var CLIENT_AUTH_USER = 0x80;
var CLIENT_SET_USERMASK = 0x81;
var CLIENT_SET_CHANNEL = 0x82;
var CLIENT_UPLOAD_INTERVAL_BEGIN = 0x83;
var CLIENT_UPLOAD_INTERVAL_WRITE = 0x84;
var CHAT_MESSAGE = 0xC0;
var KEEP_ALIVE = 0xFD;
var EXTENDED = 0xFE;
var INVALID = 0xFF;

var KEEP_ALIVE_PACKET = new Buffer('FD00000000', 'hex').toString();
