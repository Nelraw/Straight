
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/// -------------------------------- ///

import { makerOf } from './utils/functions/meta.js';

/// -------------------------------- ///

const CWD = process.cwd();

/// -------------------------------- ///

type ErrorKwargs = Global.Error.ErrorKwargs;

class BaseError extends Error {

    readonly kwargs!: ErrorKwargs;

    constructor(message: string) {
        super(message);
    }
}

class ProcessError extends BaseError {

    // declare readonly kwargs: Global.Kwargs<this>;
    
    declare name: string;

    code: number;
    reason: string;
    details: string;

    source?: Global.Kwargs<this>['source'];

    constructor(kwargs: string | Global.Error.ErrorKwargs) {
        try {
            let message: string = typeof kwargs !== 'string' 
                ? kwargs.message
                : kwargs;

            if (typeof kwargs === 'string') {
                kwargs = { message: kwargs };
            }

            super(message);

            const { name, code, reason, details } = kwargs;

            if (name) this.name = name;
            else makerOf(this).name;
    
            this.code = code ?? -1;
            this.reason = reason ?? `unknown`;
            this.details = details ?? ``;

            Object.defineProperty(this, 'kwargs', {
                value: kwargs ?? {}, enumerable: false
            });

        } catch(err) { throw err; }
    }

    get maker() { return makerOf(this); }
}

class ProcessObject {

    readonly kwargs!: Global.Kwargs<this>;

    constructor(kwargs?: Global.Dict) {
        try {
            Object.defineProperty(this, 'kwargs', {
                value: kwargs ?? {}, enumerable: false
            });

        } catch(err) { throw err; }
    }

    get maker() { return makerOf(this); }
}

/// -------------------------------- ///

class ProcessDataError extends ProcessError {

    constructor(kwargs: ErrorKwargs) {
        super(kwargs);
    }
}

class ProcessData extends ProcessObject {

    data: Global.Process.ProcessDataProperties = {};

    constructor(kwargs: Global.Process.ProcessDataKwargs) {
        try {
            super(kwargs);
            
            kwargs.auto ??= true;
            kwargs.read = kwargs.read.bind(this);

            const { data } = this;
            const { auto, read } = kwargs;
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

class Process extends ProcessObject {
    
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
