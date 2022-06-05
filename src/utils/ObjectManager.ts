import { ObjectManagerGetOptions, ObjectManagerSetOptions, ObjectManagerDeleteOptions, Reference, ObjectManagerUpdateOptions } from '../../typings';
import setValue from './setValue';
import Utils from './Utils';

class ObjectManager {
    static delete(obj: object, ref: Reference, options?: ObjectManagerDeleteOptions) {
        const array = Utils.resolveReference(ref, options);

        let _continue = true
        while(array.length > 1 && _continue == true) {
            const value = array.shift();

            obj as any
            if(!(obj as any)[value as string]) _continue = false
            else obj = (obj as any)[value as string] = (obj as any)[value as string] || {};
        }
        
        return _continue ? delete (obj as any)[array[0] as string] : false;
    }
    
    static get(obj: object, ref: Reference, options?: ObjectManagerGetOptions) {
        const array = Utils.resolveReference(ref, options);
        const data = { ...obj };

        const val = array.reduce((a, b) => ((a ?? {}) as any)[b], data);

        return val ?? null;
    }

    static has(obj: object, ref: string, options?: ObjectManagerGetOptions) {
        const array = Utils.resolveReference(ref, options);
        const data = { ...obj };

        const val = array.length > 1 ? array.slice(0, array.length - 1).reduce((a, b) => ((a ?? {}) as any)[b], data) : data;

        return array.length > 1 ? (array.pop() as string in (val || {})) : true;
    }

    static update(obj: object, ref: Reference, value: object, options?: ObjectManagerUpdateOptions) {
        value = Utils.resolveValue(value);
        
        if(!Utils.isObject(value)) {
            throw new Error('<Sydb> Value must be an object');
        }

        const array = Utils.resolveReference(ref, options);
        
        const referenceValue = this.get(obj, array, options);
        
        if(referenceValue != null && !Utils.isObject(referenceValue) && !options?.force) {
            throw new Error('<Sydb> Reference value must be an object, or force option must be set to true');
        }

        const oldValue = options?.force && !Utils.isObject(referenceValue) ? {} : { ...(referenceValue || {}) };

        const newValue = { ...oldValue, ...value };

        return this.set(obj, array, newValue, options);
    }

    static set(obj: object, ref: Reference, value: any, options?: ObjectManagerSetOptions) {
        setValue(obj, ref, Utils.resolveValue(value), options?.split ?? '/');

        return obj;
    }
}

export default ObjectManager;