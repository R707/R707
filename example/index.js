/**
 * Created by cavasblack on 16/8/17.
 */
"use strict"
const Rsos = require("../lib/master")

let rsos = new Rsos("名字", "/tuling-rsos", {connect: "localhost:2181"});

// setInterval(function () {
//
//     rsos.invoke("myservice", {
//         path: "/get/cccc",
//         method: "GET"
//     }, console.log)
//
// }, 1000);