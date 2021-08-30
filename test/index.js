const SyDB = require("../index.js");

const database = new SyDB()

console.log(database.ref("a").val())