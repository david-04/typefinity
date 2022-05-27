const typefinity = require("../index.js");

Object.getOwnPropertyNames(typefinity).forEach(item => module.exports[item] = global[item] = typefinity[item]);
