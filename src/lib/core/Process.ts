
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/// -------------------------------- ///

import { makerOf } from './utils/functions/meta.js';

/// -------------------------------- ///

const CWD = process.cwd();

/// -------------------------------- ///

type ErrorOptions<D extends Global.Dict = Global.Dict> = Global.Error.ErrorOptions<D>;
type ErrorArgs<D extends Global.Dict | undefined = undefined> = Global.Error.ErrorArgs<D>;

class ProcessError extends Error {

    declare name: string;

    declare code: number;
    declare reason: string;
    declare details: string;

    source?: object;

    constructor(options: string | ErrorOptions) {
        try {
            let message: string = typeof options !== 'string' 
                ? options.message
                : options;

            if (typeof options === 'string') {
                options = { message: options };
            }

            super(message);

            const { name, code, reason, details } = options;

            if (name) this.name = name;
            else makerOf(this).name;
    
            options.code = code ?? -1;
            options.reason = reason ?? `unknown`;
            options.details = details ?? ``;

            for (const key in options) {
                const value = options[key];
                const enumerable = false;

                Object.defineProperty(this, key, { value, enumerable });
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get maker() { return makerOf(this); }
}

// type PropertyDescriptorMode = 'value' | 'get' | 'set';

// type PropertyDescriptorSetting = { value: any } | { get: () => any } | { set: (value: any) => void }
//     | { get: () => any; set: (value: any) => void }

// type PropertyDescriptorValue = { [K in keyof PropertyDescriptorMode]: PropertyDescriptorSetting };

// type PropertyDescriptorOptions = {
//     enumerable?: boolean;
//     configurable?: boolean,
//     writable?: boolean
// };

// type PropertyDescriptor = PropertyDescriptorValue & PropertyDescriptorOptions;

// type PropertiesDescription = { [key: string]: PropertyDescriptor };


class ProcessObject {

    constructor(kwargs: { [key: string]: any } = {}) {
        try {
            for (const key in kwargs) {
                if ((this as any)[key]) continue;

                const value = kwargs[key];
                const enumerable = false;

                Object.defineProperty(this, key, { value, enumerable });
            }


        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get maker() { return makerOf(this); }
}

/// -------------------------------- ///

class ProcessDataError extends ProcessError {

    constructor(options: string | ErrorOptions) {
        super(options);
    }
}

class ProcessData extends ProcessObject {

    declare auto: boolean;

    data: Global.Process.ProcessDataProperties = {};

    constructor(options: Global.Process.ProcessDataOptions) {
        try {            
            options.auto ??= true;

            const { auto, read } = options;

            super({ auto });

            const { data } = this;
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

    ErrorOptions, ErrorArgs
}
