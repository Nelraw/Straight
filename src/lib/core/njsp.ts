
import { Process } from './Process.js';
import * as config from '../../config/njsp.config.js';

/// -------------------------------- ///

const njsp = new Process(config);
const { CONFIG, CWD, ENV, PACKAGE } = njsp;

/// -------------------------------- ///

export {
    njsp as default, 
    
    CONFIG as NPJS_CONFIG, CWD, ENV, PACKAGE
}
