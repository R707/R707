/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const ZkCli = require("./zkCli")
const EventEmitter = require("events").EventEmitter;
const Path = require("path");
class ZkCliUtils extends EventEmitter {
    constructor(zkCli) {
        if (!zkCli instanceof ZkCli) {
            throw new Error(`zkCli must be instanceof ZkCli`)
        }
        super()
        this.zkCli = zkCli;
        this.childrens = {};
    }

    watchFile(path) {
        var self = this;
        this.zkCli.watchFile(path, function (err, data) {
            self.emit("change", path, data)
        });
    }

    exist(path, callback) {
        this.zkCli.exist(path, callback)
    }

    watchDir(path) {
        var self = this;
        this.zkCli.watchDir(path, function (err, files) {
            Object.keys(self.childrens).forEach(function (key, index) {
                self.childrens[key].isExist = false;
            });
            if (files) {
                files.map(function (item, index) {
                    return [path, item].join(Path.sep);
                }).forEach(function (filename, index) {
                    if (!self.childrens[filename]) {
                        self.childrens[filename] = {isExist: true};
                        self.emit("create", filename);
                    }
                });
                Object.keys(self.childrens).forEach(function (key, index) {
                    if (!self.childrens[key].isExist) {
                        self.emit("delete", key)
                    }
                });
            }
        });
    }

    create(path, data, callback) {
        this.zkCli.create(path, data, callback)
    }

    mkdirp(path, callback) {
        this.zkCli.mkdirp(path, callback)
    }
}

module.exports = ZkCliUtils