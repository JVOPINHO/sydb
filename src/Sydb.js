const { existsSync, readFileSync, mkdirSync, writeFileSync, statSync } = require("fs")
const Collection = require("./Collection")
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

        this.filePath = filePath
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

        return {
            val: () => {
                return refVal(this._read(), path, this.options.split)
            },
            toMap: () => {
                let value = refVal(this._read(), path, this.options.split) || {}
                if(value == null || value == undefined) value = {}
                value = Object.entries(value)
                return new Collection(value)
            },
            /**
             * @param {Object|Array|string|boolean|number} value
             */
            set: (value) => {
                this.obj = manager.set(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            update: (value) => {
                this.obj = manager.update(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            delete: () => {
                this.obj = manager.delete(this._read(), path, this.options.split)
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
		return writeFileSync(this._filePath, JSON.stringify(this.obj, null, 4))
    }

    get _filePath() {
        return this.filePath.endsWith(".json") ? this.filePath : this.filePath + ".json"
    }
}

module.exports = SyDB