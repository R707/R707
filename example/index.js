/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const Rsos = require("../lib/master")

let rsos = new Rsos("名字", "/rsos");

setInterval(function () {

    rsos.invoke("mydemoservice", {hello: "name"}, console.log)

}, 1000);