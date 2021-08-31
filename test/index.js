const SyDB = require("../index.js");

const database = new SyDB()

const a = database.ref("001")

a.update({
    name: "Br"
})