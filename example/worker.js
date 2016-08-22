/**
 * Created by cavasblack on 16/8/18.
 */
"use strict"

const Worker = require("../lib/worker")

var worker = new Worker("你好,欢迎光临", "/tuling-rsos/myservice", {connect: "master:2181,slave1:2181,slave2:2181"});

worker.on("invoke", function (request, callback) {
    callback(null, JSON.stringify({result: request}))
});

worker.listen(6667)