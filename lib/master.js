/**
 * Created by cavasblack on 16/8/18.
 */
"use strict"
const Service = require("./service")
const debug = require("debug")("rsos        ")
const ZkCli = require("./utils/zkCli")
const ZkCliUtils = require("./utils/zkCliUtils")
const Path = require("path")
class RsosMaster {
    constructor(name, rootpath, opts) {
        this.services = {};
        this.zk = new ZkCli(opts)
        this.zkUtils = new ZkCliUtils(this.zk);
        this.init(rootpath);
    }

    init(rootpath) {
        var self = this;
        this.rootpath = rootpath;
        this.isExist(rootpath, function (err, file) {
            if (err) {
                self.mkdirp(rootpath, function () {
                    self.init(rootpath);
                })
            } else {
                self.zkUtils.on("create", self.createService.bind(self))
                self.zkUtils.on("delete", self.deleteService.bind(self))
                self.watchDir(rootpath);
            }
        });
    }

    isExist(rootpath, callback) {
        this.zkUtils.exist(rootpath, callback)
    }

    mkdirp(rootpath, callback) {
        this.zkUtils.mkdirp(rootpath, callback)
    }

    watchDir(rootpath) {
        this.zkUtils.watchDir(rootpath)
    }

    createService(path) {
        var self = this;
        if (this.services[path]) {
            debug(`[${path}] is already exist`)
        } else {
            debug(`create new service [${path}]`)
            var service = new Service(path, self.zk);
            this.services[path] = service;
        }
    }

    deleteService(path) {
        if (this.services[path]) {
            debug(`delete service [${path}]`)
            this.services[path].distory()
            delete this.services[path]
        } else {
            debug(`[${path}] is not exist`)
        }
    }

    invoke(serviceid, request, callback) {
        serviceid = [this.rootpath, serviceid].join(Path.sep)
        debug("invoke",serviceid,request)
        if (this.services[serviceid]) {
            this.services[serviceid].invoke(request, callback)
        } else {
            callback(new Error(404))
        }
    }
}

module.exports = RsosMaster;