/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const ZkCliUtils = require("./utils/zkCliUtils")
const debug = require("debug")("rsos-client ")
const ThriftCli = require("./utils/thriftCli")
const EventEmitter = require("events").EventEmitter;
class Client extends EventEmitter {
    constructor(clientpath, zk) {
        super()
        this.clientpath = clientpath;
        this.zk = zk;
        this.zkUtils = new ZkCliUtils(this.zk);
        this.watch(this.clientpath);
        this.zkUtils.on("change", this.onChange.bind(this));
    }

    watch(clientpath) {
        this.zkUtils.watchFile(clientpath);
    }

    onChange(path, data) {
        debug("onchange", `[${path}:${data.toString()}]`)
        var self = this;
        var json = null;
        try {
            json = JSON.parse(data);
        } catch (e) {
            json = null;
        }
        if (!json) {
            debug("create fail", `[${path}] data is illegal `)
        }
        this.host = json.host;
        this.port = json.port;
        ThriftCli.getInstance(this.host, this.port, function (err, client) {
            if (err) {
                self.onDelete(path)
                // self.emit("closed", path)
                delete self.client;
            }
            else {
                self.client = client;
                self.tried = 0;
            }
        });
    }

    onDelete(path) {
        debug("ondelete", `[${path}]`)
        this.zkUtils.delete(path, function (err) {
            debug("delete", `[${path} has been delete]${err}`)
        });
    }

    invoke(request, callback) {
        if (this.client) {
            this.client.invoke(request, callback)
        } else {
            callback(new Error(`thrift not connect!`))
        }
    }
}

module.exports = Client;