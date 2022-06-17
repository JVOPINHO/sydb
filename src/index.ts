import ObjectManager from './utils/ObjectManager';
import ObjectReference from './utils/ObjectReference';
import Database from './Sydb';
import { SydbOptions } from '../typings';

function Sydb(options: SydbOptions|string) {
    return new Database(options);
}

Sydb.Database = Database;
Sydb.ObjectManager = ObjectManager;
Sydb.ObjectReference = ObjectReference;
Sydb.Sydb = Database;

export = Sydb;