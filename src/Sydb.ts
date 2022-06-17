import fs from 'fs';
import { Reference, SydbOptions } from '../typings';
import ObjectReference from './utils/ObjectReference';
import ObjectManager from './utils/ObjectManager';

class Sydb {
    public options:  {
        path: string;
        split: string;
        autoSave: boolean;
        spaceJson: number;
    };
    public data: any = {};

    private declare autoSave: boolean;

    constructor(options: SydbOptions|string) {
        if(typeof options === 'string') {
            options = { path: options };
        }

        this.options = {
            path: options.path || './sydb.json',
            split: options.split || '/',
            autoSave: options.autoSave ?? true,
            spaceJson: options.spaceJson || 4,
        };

        this._load();
    }

    public get pathFile() {
        return this.options.path;
    }

    public ref(reference: Reference) {
        return new ObjectReference(this.data, reference, this.options, this);
    }

    public save() {
        if(this.autoSave && !this.options.autoSave) {
            // @ts-ignore
            delete this.autoSave;
            
            return;
        }

        this._write();

        return this;
    }

    private _load() {
        if(!fs.existsSync(this.options.path)) {
            this.data = {};
            return;
        }

        try {
            this.data = JSON.parse(fs.readFileSync(this.options.path, 'utf8'));
        } catch(e) {
            this.data = {};
        }

        if(typeof this.data !== 'object') {
            this.data = {};
        }
    }

    private _write() {
        const array = this.pathFile.split('/');
		array.pop()

		const path = array.join('/');

		if(array.length && !fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        
		return fs.writeFileSync(this.pathFile, JSON.stringify(this.data, null, this.options.spaceJson));
    }
}

export default Sydb;