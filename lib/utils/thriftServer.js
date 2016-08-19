/**
 * Created by cavasblack on 16/8/18.
 */
"use strict";
const Thrift = require("thrift");
const RemoteInvoke = require("../../gen-nodejs/RemoteInvoke")
const debug = require("debug")("rsos-thriftS")
const EventEmitter = require("events").EventEmitter;
class ThriftServer extends EventEmitter {
    constructor() {
        super();
        this.server = Thrift.createServer(RemoteInvoke, this);
    }

    listen(port, host) {
        this.server.listen(port, host)
    }

    invoke(request, callback) {
        this.emit("invoke", request, callback);
    }
}

module.exports = ThriftServer;