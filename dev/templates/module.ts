
/// -------------------------------- ///

import fs from 'fs/promises';

/// -------------------------------- ///

import { makerOf } from '../../src/lib/utils/functions/meta.js';

import { ProcessObject, ProcessError } from '../../src/lib/core/Process.js';

/// -------------------------------- ///
/// Variables
/// -------------------------------- ///

const bits: number = 64;

/// -------------------------------- ///
/// Types
/// -------------------------------- ///

type ExampleClassKwargs = {
    
}

/// -------------------------------- ///
/// Classes
/// -------------------------------- ///

class ExampleClassError extends ProcessError {

    /// -------------------------------- ///

    declare static readonly kwargs: ProcessError['kwargs'];

    /// -------------------------------- ///

    constructor(kwargs: ProcessError['kwargs']) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ExampleClassErrorChild extends ExampleClassError {

    /// -------------------------------- ///

    constructor(kwargs: ExampleClassError['kwargs']) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ExampleClass extends ProcessObject<ExampleClassKwargs> {

    /// -------------------------------- ///
    
    static readonly Error = ExampleClassError;

    declare static readonly kwargs: ExampleClassKwargs;
    declare readonly kwargs: ExampleClassKwargs;

    /// -------------------------------- ///

    static bits: number = 64;

    static method(...args: any[]) {
        try {


        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    readonly id!: string;
    protected readonly uid?: string;

    constructor(kwargs?: ExampleClassKwargs) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
    
    method(...args: any[]) {
        try {


        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

/// -------------------------------- ///

const exampleNbrExport: number = bits;
const exampleFnExport = (...args: any[]) => true;

export {
    ExampleClass, ExampleClassError, ExampleClassErrorChild,
    
    exampleFnExport,
    exampleNbrExport 
}

/// -------------------------------- ///
