/**
 * Created by cavasblack on 16/8/18.
 */
"use strict"

const Worker = require("../lib/worker")

var worker = new Worker("你好,欢迎光临","/rsos/myservice");

worker.listen(6667)