
declare namespace Global.Process {

    /// -------------------------------- ///
    
    type ProcessDataProperties = Dict<Primitive>;
    type ProcessDataReader = (...args: any[]) => ProcessDataProperties;

    type ProcessDataOptions = {
        auto?: boolean; 
        read?: ProcessDataReader;
    }

    type ProcessEnvOptions = ProcessDataOptions & {
        // TODO ?
    }

    type ProcessPackageOptions = ProcessDataOptions & {
        // TODO ?
    }

    type ProcessMetadataOptions = {
        env?: ProcessEnv;
        
        package?: ProcessPackage;
    }

    /// -------------------------------- ///

    type ProcessGlobalConfig = {
        debug?: boolean;
    }

    type ProcessExceptionsConfig = {
        uncaught?: (err: Error, origin?: string) => void; 
        rejection?: (err: Error, promise: Promise<any>) => void; 
    }

    type ProcessConfig = ProcessGlobalConfig & {
        exceptions?: ProcessExceptionsConfig;
    }
    
    type ProcessOptions = {
        config: ProcessConfig;
        metadata?: ProcessMetadataOptions;
    }

    /// -------------------------------- ///
}


    // type ProcessConfig = {
    //     global?: ProcessGlobalConfig;
    //     exceptions?: ProcessExceptionsConfig;
    // }