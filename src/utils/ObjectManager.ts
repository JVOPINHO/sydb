import { 
    ObjectManagerAddOptions, 
    ObjectManagerDeleteOptions, 
    ObjectManagerGetOptions,
    ObjectManagerHasOptions,
    ObjectManagerPushOptions, 
    ObjectManagerSetOptions,
    ObjectManagerSubtractOptions, 
    ObjectManagerUpdateOptions, 
    Reference,
} from '../../typings';
import setValue from './setValue';
import Utils from './Utils';

class ObjectManager {
    public add: (ref: Reference, value: number, options?: ObjectManagerAddOptions) => object;
    public delete: (ref: Reference, options?: ObjectManagerDeleteOptions) => boolean;
    public get: (ref: Reference, options?: ObjectManagerGetOptions) => {};
    public has: (ref: string, options?: ObjectManagerGetOptions) => boolean;
    public push: (ref: Reference, value: any, options?: ObjectManagerPushOptions) => object;
    public set: (ref: Reference, value: any, options?: ObjectManagerSetOptions) => object;
    public subtract: (ref: Reference, value: number, options?: ObjectManagerSubtractOptions) => object;
    public update: (ref: Reference, value: object, options?: ObjectManagerUpdateOptions) => object;

    public data: object;
    constructor(obj?: object) {
        this.data = obj || {};

        this.add = (ref, value, options) => ObjectManager.add(this.data, ref, value, options);
        this.delete = (ref, options) => ObjectManager.delete(this.data, ref, options);
        this.get = (ref, options) => ObjectManager.get(this.data, ref, options);
        this.has = (ref, options) => ObjectManager.has(this.data, ref, options);
        this.push = (ref, value, options) => ObjectManager.push(this.data, ref, value, options);
        this.set = (ref, value, options) => ObjectManager.set(this.data, ref, value, options);
        this.subtract = (ref, value, options) => ObjectManager.subtract(this.data, ref, value, options);
        this.update = (ref, value, options) => ObjectManager.update(this.data, ref, value, options);
    }
    
    static add(obj: object, ref: Reference, value: number, options?: ObjectManagerAddOptions) {
        const array = Utils.resolveReference(ref, options);

        const referenceValue = this.get(obj, array, options);

        if(referenceValue != null && isNaN(Number(referenceValue))) {
            throw new Error(`[Sydb] Reference ${String(ref)} is not an number`);
        }

        const oldValue = isNaN(Number(referenceValue)) ? 0 : Number(referenceValue);

        const newValue = oldValue + value;

        return this.set(obj, array, newValue, options);
    }

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

    static has(obj: object, ref: string, options?: ObjectManagerHasOptions) {
        const array = Utils.resolveReference(ref, options);
        const data = { ...obj };

        const val = array.length > 1 ? array.slice(0, array.length - 1).reduce((a, b) => ((a ?? {}) as any)[b], data) : data;

        return array.length > 1 ? (array.pop() as string in (val || {})) : true;
    }

    static push(obj: object, ref: Reference, value: any, options?: ObjectManagerPushOptions) {
        const array = Utils.resolveReference(ref, options);

        const referenceValue = this.get(obj, array, options);

        if(referenceValue != null && !Array.isArray(referenceValue)) {
            throw new Error(`[Sydb] Reference ${String(ref)} is not an array`);
        }

        const oldValue = Array.isArray(referenceValue) ? [...referenceValue] : [];

        const newValue = [...oldValue, ...(Array.isArray(value) && options?.assignment !== false ? value : [value])];

        return this.set(obj, array, newValue, options);
    }

    static set(obj: object, ref: Reference, value: any, options?: ObjectManagerSetOptions) {
        setValue(obj, ref, Utils.resolveValue(value), options?.split ?? '/');

        return obj;
    }

    static subtract(obj: object, ref: Reference, value: number, options?: ObjectManagerSubtractOptions) {
        const array = Utils.resolveReference(ref, options);

        const referenceValue = this.get(obj, array, options);

        if(referenceValue != null && isNaN(Number(referenceValue))) {
            throw new Error(`[Sydb] Reference ${String(ref)} is not an number`);
        }

        const oldValue = isNaN(Number(referenceValue)) ? 0 : Number(referenceValue);

        const newValue = oldValue - value;

        return this.set(obj, array, newValue, options);
    }

    static update(obj: object, ref: Reference, value: object, options?: ObjectManagerUpdateOptions) {
        value = Utils.resolveValue(value);
        
        if(!Utils.isObject(value)) {
            throw new Error('[Sydb] Value must be an object');
        }

        const array = Utils.resolveReference(ref, options);
        
        const referenceValue = this.get(obj, array, options);
        
        if(referenceValue != null && !Array.isArray(referenceValue) && !Utils.isObject(referenceValue) && !options?.force) {
            throw new Error(`<Sydb> Reference ${String(ref)} value must be an object, or force option must be set to true`);
        }

        const oldValue = options?.force && !Utils.isObject(referenceValue)  ? {} : (Array.isArray(referenceValue) ? [...referenceValue] : { ...(referenceValue || {}) });

        const newValue = Object.assign(oldValue, value);

        return this.set(obj, array, newValue, options);
    }
}

export default ObjectManager;