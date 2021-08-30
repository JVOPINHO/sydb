const { existsSync, readFileSync } = require("fs")

class SyDB {

    /**
     * @param {string} filePath
     */
    constructor(filePath = "sydb") {
        if(typeof filePath != "string") throw new Error("<SyDB> filePath must be a string.")

        this.filePath = filePath.endsWith(".json") ? filePath : filePath + ".json"

        this._read()
    }
    
    _read() {
        let obj = {}
        if(existsSync(this._filePath)) {
            const content = readFileSync(this._filePath, "utf8")
            if(content) obj = JSON.parse(content)
        }
        
        return obj
    }

    get _filePath() {
        return this.filePath.endsWith(".json") ? this.filePath : this.filePath + ".json"
    }
}

module.exports = SyDB