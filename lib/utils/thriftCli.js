/**
 * Created by cavasblack on 16/8/18.
 */
"use strict";
const Thrift = require("thrift");
const RemoteInvoke = require("../../gen-nodejs/RemoteInvoke")
const debug = require("debug")("rsos-thriftC")
class ThriftCli {
    constructor(port, host) {
        this.port = port;
        this.host = host || "localhost";
        this.client = null;
    }

    connect(callback) {
        var self = this;
        var key = self.host + ":" + self.port;
        this.connection = Thrift.createConnection(this.host, this.port, {
            max_attempts: 0
        });
        this.connection.on("error", function (err) {
            debug("error", err.message)
            if (clients[key]) {
                delete clients[key]
            }
        });
        this.connection.on("close", function () {
            debug("close", `[${self.host}:${self.port} is closed]`)
            callback(new Error(`[${self.host}:${self.port} is closed]`), self)
            if (clients[key]) {
                delete clients[key]
            }
        });
        this.connection.on("connect", function () {
            self.client = Thrift.createClient(RemoteInvoke, this);
            debug("connect", `[${key}] is connected`)
            callback(null, self);
        })
    }

    invoke(request, callback) {
        if ("object" == typeof(request)) {
            request = JSON.stringify(request)
        }
        var self = this;
        this.client.invoke(request, function (err, respone) {
            if (err) {
                return callback(err)
            }
            try {
                respone = JSON.parse(respone)
            } catch (e) {
                respone = {code: 500, error: e};
            }
            callback(respone.error, respone.result);
        });
    }

    close() {
        this.connection.end();
    }
}


var clients = {};

module.exports.getInstance = function (host, port, callback) {
    var key = host + ":" + port;
    if (clients[key]) {
        callback(null, clients[key])
    } else {
        var client = new ThriftCli(port, host);
        clients[key] = client;
        client.connect.bind(client)(callback)
    }
}