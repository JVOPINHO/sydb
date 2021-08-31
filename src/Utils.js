module.exports = {
    isObject: function(val) {
        return val != null && typeof val === 'object' && Array.isArray(val) === false;
    },
    isObjectObject: function(o) {
        return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
    },
    createObj: function() {
        const obj = {}
        return obj
    },
    setValue: require("./setValue.js"),
    /**
     * 
     * @param {Object} obj 
     * @param {string} string 
     * @param {string} split 
     * @returns 
     */
    refVal: function(obj, path, split = "/") {
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
}