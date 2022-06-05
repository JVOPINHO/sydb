export interface ObjectManagerBaseOptions {
    split?: string;
};

export interface ObjectManagerGetOptions extends ObjectManagerBaseOptions {
    returnType?: 'object' | 'map';
};

export interface ObjectManagerSetOptions extends ObjectManagerBaseOptions {};

export interface ObjectManagerUpdateOptions extends ObjectManagerBaseOptions {
    force?: boolean;
};

export interface ObjectManagerDeleteOptions extends ObjectManagerBaseOptions {};

export type Reference = string | symbol | Array<string>
