import { ObjectManagerBaseOptions, Reference } from '../../typings';
import { DefaultOptions } from './Constants';

class Utils {
    static resolveReference(reference: Reference, options?: ObjectManagerBaseOptions) {
        const split = options?.split ?? DefaultOptions.split;
    
        const keys = (Array.isArray(reference) ? reference : String(reference).split(split)).filter(Boolean);
    
        if (typeof reference === 'string' && split != '/' && /\//.test(split)) {
            return [reference];
        }
    
        for (let i = 0; i < keys.length; i++) {
            if (typeof keys[i] !== 'string') break;
    
            while (keys[i] && i < keys.length && keys[i].endsWith('\\') && typeof keys[i + 1] === 'string') {
                keys[i] = keys[i].slice(0, -1) + split + keys.splice(i + 1, 1);
            }
        }
    
        return keys;
    }
}

export default Utils;