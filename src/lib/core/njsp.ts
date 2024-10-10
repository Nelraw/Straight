
import {
    Process,
    ProcessObject, ProcessError,
    ErrorData
} from './Process.js';

import * as config from '../../config/njsp.config.js';

/// -------------------------------- ///

const njsp = new Process(config);
const { CONFIG, CWD, ENV, PACKAGE } = njsp;

/// -------------------------------- ///

export * as Print from './utils/functions/print.js';

export {
    njsp as default, njsp,
    CONFIG as NPJS_CONFIG, CWD, ENV, PACKAGE,

    ProcessObject, ProcessError, ErrorData
}
