
declare namespace Global.Process {

    type ProcessOptionsConfig = {
        debug?: boolean;
    }

    type ProcessExceptionsConfig = {
        uncaught?: (err: Error, origin?: string) => void; 
        rejection?: (err: Error, promise: Promise<any>) => void; 
    }

    type ProcessConfig = {
        options?: ProcessOptionsConfig;
        exceptions?: ProcessExceptionsConfig;
    }

    type ProcessDataProperties = Dict<Primitive>;
    type ProcessDataReader = (...args: any[]) => ProcessDataProperties;

    type ProcessDataKwargs = {
        auto?: boolean; 
        read: ProcessDataReader;
    }
}
