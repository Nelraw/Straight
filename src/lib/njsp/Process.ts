
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/// -------------------------------- ///

import { Meta, getConstructor } from '../utils/functions/meta.js';

/// -------------------------------- ///

type Dict = Global.Dict;

type ErrorData<D extends Dict = Dict> = Global.Error.ErrorData<D>;
type ProcessErrorData<D extends Dict = Dict> = Global.Error.ErrorData<D>;

/// -------------------------------- ///

import $Process = Global.Process;

type ProcessDataProperties = $Process.ProcessDataProperties;
type ProcessDataReader = $Process.ProcessDataReader;
type ProcessDataOptions = $Process.ProcessDataOptions;

type ProcessEnvOptions = $Process.ProcessEnvOptions;
type ProcessPackageOptions = $Process.ProcessPackageOptions;

type ProcessMetadataOptions = $Process.ProcessMetadataOptions;

type ProcessConfig = $Process.ProcessConfig;

type ProcessOptions = $Process.ProcessOptions;

/// -------------------------------- ///

class ProcessError extends Error {

    // _meta!: Meta;

    declare name: string;

    // code: number;
    // reason: string;
    // details: string;

    // source?: { object?: object, error?: Error };

    constructor(data: ProcessErrorData) {
        try {
            let message: string = typeof data !== 'string' 
                ? data.message
                : data;

            if (typeof data === 'string') data = { message: data };

            super(message);

            const { name, code, reason, details } = data;

            if (name) this.name = name;
            else getConstructor(this).name;
    
            // this.code = code ?? -1;
            // this.reason = reason ?? `unknown`;
            // this.details = details ?? ``;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get maker() { return getConstructor(this); }

    get meta() {
        const { _meta } = this as any;
        if (_meta) return _meta;

        const meta = new Meta(this);

        Object.defineProperty(this, '_meta', { value: meta });

        return meta;
    }
}

class ProcessObject {

    // _meta!: Meta;

    constructor() {
        try {

        } catch(err) { throw err; }
    }
    
    async init(...args: any[]) {
        try {
            return this;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get maker() { return getConstructor(this); }
    
    get meta() {
        const { _meta } = this as any;
        if (_meta) return _meta;

        const meta = new Meta(this);

        Object.defineProperty(this, '_meta', { value: meta });

        return meta;
    }
}

/// -------------------------------- ///

class ProcessDataError extends ProcessError {

    constructor(data: ProcessErrorData) {
        super(data);
    }
}

class ProcessData extends ProcessObject {

    njsp: Process;
    auto: boolean;

    data: ProcessDataProperties;

    constructor(njsp: Process, options: ProcessDataOptions) {
        try {            
            super();
            
            const read = options.read as ProcessDataReader;

            this.njsp = njsp;
            this.auto = options.auto ?? true;

            this.data = {};

            const { data } = this;
            const update = () => Object.assign(data, read());

            if (this.auto === true) update();

            const get = (target: typeof this, key: string) => {
                try {
                    if (key === 'update') return update;

                    return (target as any)[key] ?? (data as any)[key];

                } catch(err) { throw err; }
            }

            return new Proxy(this, { get });

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ProcessEnvError extends ProcessDataError {

    constructor(env: ProcessEnv, err: Error) {
        try {
            const source = { object: env, error: err };
            const message = `Unable to load ENV`;

            super({ message, source });
             
        } catch(err) { throw err; }
    }
}

class ProcessEnv extends ProcessData {

    constructor(njsp: Process, options: ProcessEnvOptions = {}) {
        try {
            options.read ??= () => {
                try {
                    const { env } = process;
                    if (!env.NODE_ENV) dotenv.config();

                    return env;

                } catch(err: any) { throw new ProcessEnvError(this, err); } 
            }

            super(njsp, options);

        } catch(err) { throw err;  }
    }
}

class ProcessPackageError extends ProcessDataError {

    constructor(pkg: ProcessPackage, err: Error) {
        try {
            const source = { object: pkg, error: err };
            const message = `Unable to read package.json`;

            super({ message, source });
             
        } catch(err) { throw err; }
    }
}

class ProcessPackage extends ProcessData {

    constructor(njsp: Process, options: ProcessPackageOptions = {}) {
        try {
            options.read ??= () => {
                try {
                    const cwd = process.cwd();
                    const path = resolve(cwd, 'package.json');
                    const file = readFileSync(path, 'utf-8');
        
                    return JSON.parse(file);

                } catch(err: any) { throw new ProcessPackageError(this, err); }
            }

            super(njsp, options);
            
        } catch(err) { throw err; }
    }
}

class ProcessMetadata extends ProcessObject {

    readonly njsp: Process;

    CWD: string;
    ENV: ProcessEnv;
    PACKAGE: ProcessPackage;

    constructor(njsp: Process, options?: ProcessMetadataOptions) {
        try {
            super();

            this.njsp = njsp;

            const CWD = process.cwd().replace('file///', '')
            this.CWD = CWD.replaceAll('\\', '/');

            const { env, package: pkg } = options ?? {};

            this.ENV = new ProcessEnv(njsp, env);
            this.PACKAGE = new ProcessPackage(njsp, pkg);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class Process extends ProcessObject {

    native!: typeof process;

    config!: ProcessConfig;
    readonly metadata!: ProcessMetadata;

    constructor(options: ProcessOptions) {
        try {
            super();

            const { config, metadata } = options;
            
            this.native = process;

            this.config = config;
            this.metadata = new ProcessMetadata(this, metadata);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get CWD(): string { return this.metadata.CWD; }
    get ENV(): Dict { return this.metadata.ENV; }
    get PACKAGE(): Dict { return this.metadata.PACKAGE; }

    get pid(): number { return this.native.pid; }
}

/// -------------------------------- ///

export {
    Process, type ProcessOptions,
    ProcessMetadata, type ProcessMetadataOptions,

    ProcessObject, ProcessError, ProcessErrorData, ErrorData
}
