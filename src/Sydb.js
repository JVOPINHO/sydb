const { existsSync, readFileSync, mkdirSync, writeFileSync, statSync } = require("fs")
const { createObj, isObject, setValue } = require("./Utils")

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
        if(path && typeof path != "string") throw new Error("Sydb#musbe a string.")
        if(!path) path = ""

        return {
            val: () => {
                return this.constructor.val(this._read(), path, this.options.split)
            },
            toMap: () => {
                let value = this.constructor.val(this._read(), path, this.options.split) || {}
                if(value == null || value == undefined) value = {}
                value = Object.entries(value)
                return new Map(value)
            },
            /**
             * @param {Object|Array|string|boolean|number} value
             */
            set: (value) => {
                this.obj = this.constructor.set(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            /**
             * 
             * @param {Object} value
             */
            update: (value) => {
                this.obj = this.constructor.update(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            /**
             * 
             * @param {Object|Array|string|boolean|number} value 
             * @param {{
             *  force:boolean,
             * flat:boolean
             * }} options 
             */
            push: (value, options) => {
                /**
                 * @type {Array}
                 */
                let val = this.constructor.val(this._read(), path, this.options.split)
                if(val == null || (!Array.isArray(val) && options.force == true)) val = []
                
                if(!Array.isArray(val) && options.force != true) return false
                
                if(options.flat != false && Array.isArray(value)) val = [...val, ...value]
                else val = [...val, value]

                this.obj = this.constructor.set(this._read(), path, val, this.options.split)
                this._write()
                return this.obj
            },
            delete: () => {
                this.obj = this.constructor.delete(this._read(), path, this.options.split)
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

    /**
     * 
     * @param {Object} obj 
     * @param {string} string 
     * @param {string} split 
     */
    static val(obj, path, split = "/") {
        const array = String(path).split(String(split)).filter(x => x)
        const data = { ...obj };

        const val = array.reduce((a, b) => (typeof a != "undefined" ? a : {})[b], data)
        return typeof val != "undefined" ? val : null
    }

    /**
    * 
    * @param {Object} obj 
    * @param {string} ref 
    * @param {any} value 
    * @param {string} split
    */
    static set(obj, ref, value, split = "/") {
        const data = { ...obj }
        if(value instanceof Map) value = Object.fromEntries(value)
        if(typeof value == "undefined") value = null
        if(!ref && !isObject(value)) throw new Error("Sydb#set must be a object.")
        else if(!ref && isObject(value)) return value
        else {
           setValue(data, ref, value, split)
           return data
        }
    }

    /**
    * 
    * @param {Object} obj 
    * @param {string} ref 
    * @param {any} value 
    * @param {string} split
    */
    static update(obj, ref, value, split = "/") {
        if(!isObject(value)) throw new Error("Sydb#update must be a object.")
        const pathValue = this.val(obj, ref, split)
        
        if(!pathValue) {
            setValue(obj, ref, value, split)
            return obj
        }
        
        if(!isObject(pathValue)) {
            setValue(obj, ref, value, split)
            return obj
        }
        
        Object.keys(value).forEach((key) => {
            let _value = value[key]
            if(_value instanceof Map) _value = Object.fromEntries(_value)
            setValue(obj, `${ref ? `${ref}${split}` : ""}${key}`, _value, split)
        })

        return obj
    }

    /**
    * 
    * @param {Object} obj 
    * @param {string} ref 
    * @param {any} value 
    * @param {string} split
    */
    static delete(obj, ref, split = "/") {
        if(!ref) return createObj()
        let _obj = obj
        let array = ref.split(split).filter(x => x)
        let _continue = true
        while(array.length > 1 && _continue == true) {
            let value = array.shift()
            if(!_obj[value]) _continue = false
            else _obj = _obj[value] = _obj[value] || createObj()
        }
        if(_continue == true) delete _obj[array]
        return _obj
    }
}

module.exports = SyDB