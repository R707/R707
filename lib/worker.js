/**
 * Created by cavasblack on 16/8/18.
 */
"use strict"
const ThriftServer = require("./utils/thriftServer")
const debug = require("debug")("rsos-worker")
const ZkCli = require("./utils/zkCli")
const ZkCliUtils = require("./utils/zkCliUtils")
const Path = require("path")
const EventEmitter = require("events").EventEmitter;
class RsosWorker extends EventEmitter{
    constructor(name, servicepath, opts) {
        super()
        this.zk = new ZkCli(opts);
        this.zkUtils = new ZkCliUtils(this.zk);
        this.server = new ThriftServer();
        this.name = name;
        this.servicepath = servicepath;
        this.server.on("invoke", this.onInvoke.bind(this))

    }

    listen(port, host) {
        this.port = port;
        this.host = host || "localhost";
        this.server.listen(port, host)
        debug("listen", this.host, ":", this.port)
        this.init()
    }

    init() {
        var self = this;
        this.isExist(this.servicepath, function (err) {
            if (err) {
                self.mkdirp(self.servicepath, function (status) {
                    if (!status) {
                        throw status;
                    } else {
                        self.init()
                    }
                })
            } else {
                self.create([self.servicepath, Date.now()].join(Path.sep), JSON.stringify({
                    host: self.host,
                    port: self.port
                }), function (err) {
                    if (err)throw err;
                })
            }
        });
    }

    create(path, data, callback) {
        this.zkUtils.create(path, data, callback)
    }

    onInvoke(request, callback) {
        debug("invoke", request)
        this.emit("invoke",request,callback)
        // callback(null, JSON.stringify({
        //     error: null,
        //     result: request
        // }))
    }

    isExist(servicepath, callback) {
        this.zkUtils.exist(servicepath, callback)
    }

    mkdirp(servicepath, callback) {
        this.zkUtils.mkdirp(servicepath, callback)
    }
}

module.exports = RsosWorker;