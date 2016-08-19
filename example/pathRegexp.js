/**
 * Created by cavasblack on 16/8/18.
 */
const pathToRegexp = require("path-to-regexp");

var key = "/mydemoservice/:aaaaa/:bbbb";

var value = "/mydemoservice/aaaa/bbbb";

var regexp = pathToRegexp(key)

var result = regexp.exec(value)
console.log(result)
var method = result.slice(1)

var params = {};

regexp.keys.forEach(function(item,index){
    params[item.name] = method[index]
});
console.log(key)
console.log(value)
console.log(params)