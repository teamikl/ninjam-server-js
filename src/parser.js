'use strict';

var util = require('util');
var assert = require('assert').ok;
var Transform = require('stream').Transform;
var streamParserMixin = require('stream-parser');
var SmartBuffer = require('smart-buffer');

var HEADER_SIZE = 5;

function Parser() {
  Transform.call(this);

  this.msgCode = 0xFF;
  this.msgLength = 0;

  this._bytes(HEADER_SIZE, this.onHeader);
}
util.inherits(Parser, Transform);
streamParserMixin(Parser.prototype);

/*jshint unused:vars */
Parser.prototype.onPayload = function onPayload(buffer, output) {
  assert(this.msgLength === buffer.length);

  this.emit('message', this.msgCode, new SmartBuffer(buffer));

  this._bytes(HEADER_SIZE, this.onHeader);
};

/*jshint unused:vars */
Parser.prototype.onHeader = function onHeader(buffer, output) {

  assert(buffer.length === HEADER_SIZE);

  this.msgCode = buffer.readUInt8(/* offset: */ 0);
  var msgLength = this.msgLength = buffer.readUInt32LE(/* offset: */ 1);

  if (msgLength > 0) {
    this._bytes(msgLength, this.onPayload);
  } else {
    // NOTE: skip keep-alive payload
    this.emit('message', this.msgCode, null);
    this._bytes(HEADER_SIZE, this.onHeader);
  }
};
/*jshint unused:true */

module.exports = Parser;
