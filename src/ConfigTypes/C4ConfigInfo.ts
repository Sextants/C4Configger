import C4AJV    from 'c4ajv';

export enum C4ConfigFileType {
    Yml     = "yml",
    Yaml    = "yaml",
    JSON    = "json"
}

export interface C4ConfigDir {
    Path : string,
    main : string
}

export interface C4ConfigService {
    host : string,
    user : string,
    pass : string
}

export interface Macro {
    Marco   : string,
    Process : (value : string, configInfo : C4ConfigInfo) => string
}

export interface C4ConfigInfo {
    ConfigDir       : C4ConfigDir;
    ConfigService  ?: C4ConfigService;
    AppName         : string;
    Version         : string;
    host            : string;
    port            : number;
    InstanceID      : string;
    Profiles        : string[] | string;
    Label          ?: string;
    Macros          : any;
    Checker        ?: C4AJV
}
