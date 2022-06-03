import { Reference } from '../../typings';
import Utils from './Utils';

function isObject(val: any) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

const isUnsafeKey = (key: string) => {
    return key === '__proto__' || key === 'constructor' || key === 'prototype';
};

const validateKey = (key: string) => {
    if (isUnsafeKey(key)) {
        throw new Error(`<Sydb> Cannot set unsafe key: '${key}'`);
    }
};

const setProp = (obj: any, prop: string, value: any) => {
    validateKey(prop);

    if (value === undefined) {
        delete obj[prop];

    } else {
        obj[prop] = value;
    }

    return obj;
};

const setValue = (obj: any, path: Reference, value:  any, split: string) => {
    if(value instanceof Map) value = Object.fromEntries(value)
    if (!path) return value;
    if (!isObject(obj)) return obj;

    const keys = Utils.resolveReference(path, { split });
    const len = keys.length;
    const target = obj;

    for (let i = 0; i < len; i++) {
        const key = keys[i];
        const next = keys[i + 1];

        validateKey(key);

        if (next === undefined) {
            setProp(obj, key, value);
            break;
        }

        if (!isObject(obj[key])) {
            obj[key] = {};
        }

        obj = obj[key];
    }

    return target;
};

setValue.cache = new Map();
setValue.clear = () => {
    setValue.cache.clear();
};

export default setValue;