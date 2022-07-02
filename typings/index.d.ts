/* ObjectManager */

export interface ObjectManagerAddOptions extends ObjectManagerBaseOptions {}

export interface ObjectManagerBaseOptions {
    split?: string;
};

export interface ObjectManagerDeleteOptions extends ObjectManagerBaseOptions {};

export interface ObjectManagerGetOptions extends ObjectManagerBaseOptions {
    returnType?: 'object' | 'map';
};

export interface ObjectManagerHasOptions extends ObjectManagerBaseOptions {};

export interface ObjectManagerPushOptions extends ObjectManagerBaseOptions {
    assignment?: boolean;
};

export interface ObjectManagerSetOptions extends ObjectManagerBaseOptions {};

export interface ObjectManagerSubtractOptions extends ObjectManagerBaseOptions {};

export interface ObjectManagerUpdateOptions extends ObjectManagerBaseOptions {
    force?: boolean;
};

/* ObjectReference */

export interface ObjectReferenceOptions {
    split?: string;
} 

/* Schema */

export type SchemaObject = { [x: string | number]: SchemaType };

export type SchemaType = SchemaObject | StringConstructor | NumberConstructor | SchemaType[] | Schema | null | { type: SchemaType, required?: boolean, default?: any };

/* Sydb */

export interface SydbOptions {
    path: string;
    split?: string;
    autoSave?: boolean;
    spaceJson?: number;
}

export type Reference = string | symbol | Array<string>