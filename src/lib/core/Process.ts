
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/// -------------------------------- ///

import { makerOf } from './utils/functions/meta.js';

/// -------------------------------- ///

const CWD = process.cwd();

/// -------------------------------- ///

class BaseError extends Error {

    static readonly kwargs: Global.Error.ErrorKwargs;
    readonly kwargs!: Global.Error.ErrorKwargs;

    constructor(message: string) {
        super(message);
    }
}

class ProcessError extends BaseError {
    
    declare static readonly kwargs: Global.Error.ErrorKwargs;
    declare readonly kwargs: Global.Error.ErrorKwargs;

    declare name: string;

    code: number;
    reason: string;
    details: string;

    source?: Global.Error.ErrorKwargs['source'];

    constructor(kwargs: Global.Error.ErrorKwargs) {
        try {
            const message = typeof kwargs !== 'string' 
                ? kwargs.message
                : kwargs;

            // kwargs = kwargs as Global.Error.ErrorKwargs;

            super(message);

            const { name, code, reason, details } = kwargs;

            if (name) this.name = name;
            else makerOf(this).name;
    
            this.code = code ?? -1;
            this.reason = reason ?? `unknown`;
            this.details = details ?? ``;

        } catch(err) { throw err; }
    }

    get maker() { return makerOf(this); }
}

class ProcessObject<KW extends Global.Dict = Global.Dict> {
    
    static readonly Error = ProcessError;

    static readonly kwargs: Global.Dict;
    readonly kwargs!: KW;

    constructor(kwargs?: KW) {
        try {
            Object.defineProperty(this, 'kwargs', {
                value: kwargs ?? {}, enumerable: false
            });

        } catch(err) { throw err; }
    }

    get maker() { return makerOf(this); }

    protected get Error() { return makerOf(this).Error; }
    
    error(args?: Global.Error.ErrorArgs) {
        try {
            const error = this.Error;

            return args ? new error(args) : error;

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

class ProcessDataError extends ProcessError {

    declare static readonly kwargs: Global.Error.ErrorKwargs;

    constructor(kwargs: Global.Error.ErrorKwargs) {
        super(kwargs);
    }
}

class ProcessData extends ProcessObject<Global.Process.ProcessDataKwargs> {

    static readonly Error = ProcessDataError;

    declare static readonly kwargs: Global.Process.ProcessDataKwargs;
    declare readonly kwargs: Global.Process.ProcessDataKwargs;

    data: Global.Process.ProcessDataProperties = {};

    constructor(kwargs: Global.Process.ProcessDataKwargs) {
        try {
            super(kwargs);
            
            kwargs.auto ??= true;
            kwargs.read = kwargs.read.bind(this);

            const { kwargs: { auto, read }, data } = this;
            const update = () => Object.assign(data, read());

            if (auto === true) update();

            const get = (target: typeof this, key: string, receiver: any) => {
                try {
                    if (key === 'update') return update;

                    return (target as any)[key] ?? (data as any)[key];

                } catch(err) { throw err; }
            }

            return new Proxy(this, { get });

        } catch(err) { throw err; }
    }
}

class ProcessEnvError extends ProcessDataError {

    constructor(error: Error) {
        try {
            const source = { error };
            const message = `Unable to load ENV`;

            super({ message, source });
             
        } catch(err) { throw err; }
    }
}

class ProcessEnv extends ProcessData {

    static readonly Error = ProcessEnvError;

    constructor(auto: boolean = true) {
        try {
            const read = () => {
                try {
                    const { env } = process;
                    if (!env.NODE_ENV) dotenv.config();

                    return env;

                } catch(err: any) { throw new ProcessEnvError(err); } 
            }

            super({ auto, read });

        } catch(err) { throw err;  }
    }
}

class ProcessPackageError extends ProcessDataError {

    constructor(error: Error) {
        try {
            const source = { error };
            const message = `Unable to read package.json`;

            super({ message, source });
             
        } catch(err) { throw err; }
    }
}

class ProcessPackage extends ProcessData {

    static readonly Error = ProcessPackageError;

    constructor(auto: boolean = true) {
        try {
            const read = () => {
                try {
                    const cwd = process.cwd();
                    const path = resolve(cwd, 'package.json');
                    const file = readFileSync(path, 'utf-8');
        
                    return JSON.parse(file);


                } catch(err: any) { throw new ProcessPackageError(err); } 
            }

            super({ auto, read });
            
        } catch(err) { throw err; }
    }
}

class ProcessMetadata {
    static CONFIG: Global.Process.ProcessConfig;
    static ENV: ProcessEnv = new ProcessEnv();
    static PACKAGE: ProcessPackage = new ProcessPackage();
    static CWD: string = CWD.replace('file///', '').replaceAll('\\', '/');
}

class Process extends ProcessObject<Global.Process.ProcessConfig> {
    
    static readonly Error = ProcessError;

    declare static readonly kwargs: Global.Process.ProcessConfig;
    declare readonly kwargs: Global.Process.ProcessConfig;

    native!: typeof process;

    constructor(kwargs?: Global.Process.ProcessConfig) {
        try {
            super(kwargs);
            
            ProcessMetadata.CONFIG = kwargs ?? {};

            Object.defineProperty(this, 'native', {
                value: process, enumerable: false
            });

        } catch(err) { throw err; }
    }

    get metadata(): ProcessMetadata { return ProcessMetadata; }

    get CONFIG(): Global.Process.ProcessConfig { return ProcessMetadata.CONFIG; }

    get ENV(): Global.Dict { return ProcessMetadata.ENV; }
    get PACKAGE(): Global.Dict { return ProcessMetadata.PACKAGE; }
    get CWD(): string { return ProcessMetadata.CWD; }

    get pid(): number { return this.native.pid; }
}

/// -------------------------------- ///

export {
    Process, ProcessMetadata,

    ProcessObject, ProcessError,
}
