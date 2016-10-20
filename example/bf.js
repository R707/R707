/**
 * Created by cavasblack on 16/8/23.
 */
"use strict"

var fn = function (input) {
    let strs = input.split("")
    let tag;
    let result = [];
    while (true) {
        let item = strs.shift();
        if (!item) {
            break;
        }
        if (tag != item) {
            result.push(tag = item)
        }
    }
    return result
}

console.log(fn("AAABBBCCCAAA"))
console.log(fn("AAAccBBBCCCccAAA"))
console.log(fn("12233"))
console.log(fn([1,2,2,3,3]))