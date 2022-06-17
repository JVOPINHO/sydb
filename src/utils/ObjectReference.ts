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
        ObjectManager.add(this.data, this.reference, value, options);
        
        this._save();

        return this;
    }

    public delete(options?: ObjectManagerDeleteOptions) {
        ObjectManager.delete(this.data, this.reference, options);

        this._save();

        return this;
    };

    public get(options?: ObjectManagerGetOptions) {
        return ObjectManager.get(this.data, this.reference, options);
    };
    
    public has(options?: ObjectManagerHasOptions) {
        return ObjectManager.has(this.data, this.reference, options);
    };

    public push(value: any, options?: ObjectManagerPushOptions) {
        ObjectManager.push(this.data, this.reference, value, options);

        this._save();

        return this;
    };

    public ref(reference: Reference) {
        reference = `${this.reference as string}${this.options.split}${reference as string}`;

        return new ObjectReference(this.data, reference, this.options, this.managerDatabase);
    }

    public set(value: any, options?: ObjectManagerSetOptions) {
        ObjectManager.set(this.data, this.reference, value, options);

        this._save();

        return this;
    };
    
    public subtract(value: number, options?: ObjectManagerSubtractOptions) {
        ObjectManager.subtract(this.data, this.reference, value, options);

        this._save();

        return this;
    };

    public update(value: object, options?: ObjectManagerUpdateOptions) {
        ObjectManager.update(this.data, this.reference, value, options);

        this._save();

        return this;
    };

    public val(options?: ObjectManagerGetOptions) {
        return ObjectManager.get(this.data, this.reference, options);
    };

    private _save() {
        return this.managerDatabase?.save.bind(Object.assign(this.managerDatabase, { autoSave: true }))();
    }

    public save() {
        if(!this.managerDatabase) {
            throw new Error('[Sydb] No manager database found');
        }

        this.managerDatabase?.save();
    }
}

export default ObjectReference;