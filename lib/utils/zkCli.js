/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const Zookeeper = require("zookeeper")

const debug = require("debug")("zkcli")

var formatCallback = function (callback) {
    return function (rc, error) {
        if (0 === rc) return callback(null, arguments[arguments.length - 1])
        return callback(new Error(error))
    }
}

var watchCallback = function (fn) {
    return function (path, callback) {
        return function (type, state, path) {
            if (fn) fn.bind(this)(path, callback)
        }.bind(this)
    }.bind(this)
}

class ZkCli {
    constructor(opts) {
        this.opts = opts || {
                connect: "localhost:2181",
                timeout: 20000,
                debug_level: Zookeeper.ZOO_LOG_LEVEL_WARN,
                host_order_deterministic: false
            }
        this.client = new Zookeeper({
            connect: this.opts.connect,
            timeout: this.opts.timeout,
            debug_level: this.opts.debug_level,
            host_order_deterministic: this.opts.host_order_deterministic || false
        })
        this.client.connect(function (err) {
            if (err) throw err;
        })
    }

    watchDir(path, callback) {
        this.client.aw_get_children(path, watchCallback.bind(this)(this.watchDir)(path, callback), formatCallback(callback))
    }

    watchFile(path, callback) {
        this.client.aw_get(path, watchCallback.bind(this)(this.watchFile)(path, callback), formatCallback(callback))
    }

    get(path, callback) {
        this.client.a_get(path, false, formatCallback(callback))
    }

    set(path, data, callback) {
        this.client.a_set(path, data, -1, formatCallback(callback))
    }

    delete(path, callback) {
        this.client.a_delete_(path, -1, formatCallback(callback))
    }

    create(path, data, callback) {
        this.client.a_create(path, data, Zookeeper.ZOO_EPHEMERAL, formatCallback(callback))
    }

    mkdirp(path, callback) {
        this.client.mkdirp(path, formatCallback(callback))
    }

    exist(path, callback) {
        this.client.a_exists(path, false, formatCallback(callback))
    }
}

module.exports = ZkCli;