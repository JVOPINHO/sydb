const { existsSync, readFileSync, mkdirSync, writeFileSync } = require("fs")
const manager = require("./Manager")
const { refVal, createObj } = require("./Utils")

/*
Modified version of Object Management Library https://github.com/JVOPINHO/ObjRef/
*/

class SyDB {

    /**
     * @param {string} filePath
     */
    constructor(filePath = "sydb", options = {}) {
        if(typeof filePath != "string") throw new Error("<Sydb> filePath must be a string.")

        this.filePath = filePath.endsWith(".json") ? filePath : filePath + ".json"
        this.options = {
            split: options.split || "/"
        }

        this.obj = this._read()
    }
    
    /**
     * 
     * @param {string} path 
     * @returns 
     */
    ref(path) {
        if(path && typeof path != "string") throw new Error("<Sydb>.ref() must be a string.")
        if(!path) path = ""
        this.obj = this._read()

        return {
            /**
             * @param {object} options
             */
            val: (options) => {
                return refVal(this.obj, path, this.options.split)
            },
            set: (value) => {
                this.obj = manager.set(this.obj, path, value, this.options.split)
                this._write()
                return this.obj
            }
        }
    }
    
    _read() {
        let obj = createObj()
        if(existsSync(this._filePath)) {
            const content = readFileSync(this._filePath, "utf8")
            if(content) obj = JSON.parse(content)
        }
        
        return obj
    }

    _write() {
        const array = this._filePath.split("/")
		array.pop()

		const path = array.join("/")

		if(array.length && !existsSync(path)) mkdirSync(path, { recursive: true })
		return writeFileSync(this._filePath, JSON.stringify(this.obj, null, 2))
    }

    get _filePath() {
        return this.filePath.endsWith(".json") ? this.filePath : this.filePath + ".json"
    }
}

module.exports = SyDB