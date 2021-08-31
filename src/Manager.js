const { isObject, setValue, createObj, refVal } = require("./Utils")

module.exports = {
    /**
     * 
     * @param {Object} obj 
     * @param {string} ref 
     * @param {any} value 
     * @param {string} split 
     * @returns 
     */
    set: function(obj, ref, value, split = "/") {
        const data = { ...obj }
        if(!ref && !isObject(value)) throw new Error("<Sydb>.ref().set() must be a object.")
        else if(!ref && isObject(value)) return value
        else {
            setValue(data, ref, value, split)
            return data
        }
    },
    update: function(obj, ref, value, split = "/") {
        if(!isObject(value)) throw new Error("<Sydb>.ref(...).update() must be a object.")
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
            setValue(obj, `${ref ? `${ref}${split}` : ""}${key}`, value[key], split)
        })
        return obj
    },
    push: function(obj, ref, value, split = "/") {
        const data = { ...obj }
        if(!ref && !Array.isArray(value)) throw new Error("<Sydb>.ref().push() must be a array.")
        else if(!ref && Array.isArray(value)) return value
        else {
            setValue(data, ref, value, split)
            return data
        }
    },
    delete: function(obj, ref, split = "/") {
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