import { ObjectManagerGetOptions, ObjectManagerSetOptions, ObjectManagerDeleteOptions, Reference } from '../../typings';
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

    static set(obj: object, ref: Reference, value: any, options?: ObjectManagerSetOptions) {
        setValue(obj, ref, value, options?.split ?? '/');

        return obj;
    }
}

export default ObjectManager;