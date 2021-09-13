const { existsSync, readFileSync, mkdirSync, writeFileSync, statSync } = require("fs")
const manager = require("./Manager")
const { refVal, createObj, isObject, setValue } = require("./Utils")

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
                return refVal(this._read(), path, this.options.split)
            },
            toMap: () => {
                let value = refVal(this._read(), path, this.options.split) || {}
                if(value == null || value == undefined) value = {}
                value = Object.entries(value)
                return new Map(value)
            },
            /**
             * @param {Object|Array|string|boolean|number} value
             */
            set: (value) => {
                this.obj = manager.set(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            /**
             * 
             * @param {Object} value
             */
            update: (value) => {
                manager.update(this._read(), path, value, this.options.split)
                this._write()
                return this.obj
            },
            /**
             * 
             * @param {Object|Array|string|boolean|number} value 
             * @param {Object} options 
             */
            push: (value, options) => {
                if(!value) return false
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

    /**
     * 
     * @param {Object} obj 
     * @param {string} string 
     * @param {string} split 
     * @returns 
     */
    static val(obj, path, split = "/") {
        let array = path.split(split).filter(x => x)
        let valor = { ...obj };
        for(let element of array.filter(x => x)) {
          if(valor) valor = valor[`${element}`]
          else {
            valor = null;
            break;
          };
        }
    
        return valor
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
        const pathValue = refVal(obj, ref, split)
        
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