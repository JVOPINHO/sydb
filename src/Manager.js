const { isObject, setValue } = require("./Utils")

module.exports = {
    /**
     * 
     * @param {object} obj 
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
    }
}