/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const ZkCliUtils = require("./utils/zkCliUtils")
const debug = require("debug")("rsos-service")
const Client = require("./client")
class Service {
    constructor(servicepath, zk) {
        this.servicepath = servicepath;
        this.zk = zk;
        this.zkUtils = new ZkCliUtils(this.zk);
        this.clients = {};
        this.watch(this.servicepath);
        this.watchDir(this.servicepath);
        this.zkUtils.on("delete", this.deleteClient.bind(this))
        this.zkUtils.on("create", this.createClient.bind(this))
        this.zkUtils.on("change", this.onChange.bind(this))
        this.clientIndex = 0;
    }

    watch(servicepath) {
        this.zkUtils.watchFile(servicepath);
    }

    onChange(path, data) {
        debug("onchange", `[${path}]:${data.toString()}`)
    }

    watchDir(servicepath) {
        this.zkUtils.watchDir(servicepath)
    }

    createClient(path) {
        debug("oncreate", `[${path}]`)
        if (this.clients[path]) {
            debug("oncreate", `[${path}] is already exist!`)
        } else {
            debug(`create new client [${path}]`)
            var self = this;
            var client = new Client(path, this.zk);
            this.clients[path] = client;
        }
    }

    deleteClient(path) {
        debug("ondelete", `[${path}]`)
        if (this.clients[path]) {
            var self = this;
            debug(`delete client [${path}]`);
            delete this.clients[path]
            if (!Object.keys(this.clients).length) {
                self.zkUtils.delete(this.servicepath, function (err) {
                    debug("delete", `[${self.servicepath} has been delete]:${err}`)
                });
            }
        } else {
            debug(`[${path}] client is not exist`);
        }
    }

    invoke(request, callback) {
        this.clientIndex++;
        let keys = Object.keys(this.clients);
        if (this.clientIndex >= keys.length) {
            this.clientIndex = 0;
        }
        if(this.clients[keys[this.clientIndex]]){
            this.clients[keys[this.clientIndex]].invoke(request, callback)
        }else{
            callback(new Error(404))
        }

    }

    distory() {

    }
}

module.exports = Service;