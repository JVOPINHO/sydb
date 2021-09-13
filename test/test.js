const SyDB = require("../index.js");

const database = new SyDB(__dirname + "/sydb")

console.log(database.ref().toMap())