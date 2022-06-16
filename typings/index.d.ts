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

export interface ObjectReferenceOptions {
    split?: string;
} 

export interface SydbOptions {
    path: string;
    split?: string;
    autoSave?: boolean;
    spaceJson?: number;
}

export type Reference = string | symbol | Array<string>
