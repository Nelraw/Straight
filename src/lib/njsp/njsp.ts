
import { Process, ProcessObject, ProcessError, type ErrorData } from './Process.js';

import * as config from '../../config/njsp.config.js';

/// -------------------------------- ///

const njsp = new Process({ config });
const { CWD, ENV, PACKAGE } = njsp;

/// -------------------------------- ///

import { Print } from '../utils/functions/print.js';

const NJSP = {
    Process,
    ProcessObject, ProcessError,

    njsp, CWD, ENV, PACKAGE,
    
    Print
}

export {
    njsp as default, njsp,
    CWD, ENV, PACKAGE,

    ProcessObject, ProcessError, Print,

    type ErrorData,
}
