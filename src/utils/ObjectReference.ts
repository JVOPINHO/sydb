import ObjectManager from './ObjectManager';
import Sydb from '../Sydb';
import Utils from './Utils';
import * as Constants from './Constants';

import { 
    ObjectReferenceOptions,
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

class ObjectReference {
    public reference: Reference;
    public options: ObjectReferenceOptions;
    public data: object;
    public declare managerDatabase: Sydb;

    constructor(obj: object, reference: Reference, options?: ObjectReferenceOptions, managerDatabase?: Sydb) {
        this.data = obj;
        
        this.options = {
            split: options?.split ?? Constants.DefaultOptions.split,
        };

        this.reference = Utils.resolveReference(reference).join(options?.split);

        Object.defineProperty(this, 'managerDatabase', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: managerDatabase,
        });
    }

    public add(value: number, options?: ObjectManagerAddOptions) {
        const result = ObjectManager.add(this.data, this.reference, value, options);
        
        this._save();

        return result;
    }

    public delete(options?: ObjectManagerDeleteOptions) {
        const result = ObjectManager.delete(this.data, this.reference, options);

        this._save();

        return result;
    };

    public get(options?: ObjectManagerGetOptions) {
        return ObjectManager.get(this.data, this.reference, options);
    };
    
    public has(options?: ObjectManagerHasOptions) {
        return ObjectManager.has(this.data, this.reference, options);
    };

    public push(value: any, options?: ObjectManagerPushOptions) {
        const result = ObjectManager.push(this.data, this.reference, value, options);

        this._save();

        return result;
    };

    public ref(reference: Reference) {
        reference = `${this.reference as string}${this.options.split}${reference as string}`;

        return new ObjectReference(this.data, reference, this.options, this.managerDatabase);
    }

    public set(value: any, options?: ObjectManagerSetOptions) {
        const result = ObjectManager.set(this.data, this.reference, value, options);

        this._save();

        return result;
    };
    
    public subtract(value: number, options?: ObjectManagerSubtractOptions) {
        const result = ObjectManager.subtract(this.data, this.reference, value, options);

        this._save();

        return result;
    };

    public update(value: object, options?: ObjectManagerUpdateOptions) {
        const result = ObjectManager.update(this.data, this.reference, value, options);

        this._save();

        return result;
    };

    public val(options?: ObjectManagerGetOptions) {
        return ObjectManager.get(this.data, this.reference, options);
    };

    private _save() {
        return this.managerDatabase?.save.bind({ ...this.managerDatabase, private: true });
    }

    public save() {
        if(!this.managerDatabase) {
            throw new Error('[Sydb] No manager database found');
        }

        this.managerDatabase?.save();
    }
}

export default ObjectReference;