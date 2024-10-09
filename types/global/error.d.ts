
declare namespace Global.Error {
    type ErrorKwargs<D extends Dict = Dict> = Dict & {
        message: string;

        name?: string; code?: number;
        reason?: string; details?: string;

        source?: { error?: Error, object?: any };
    }
    
    type ErrorArgs = ErrorKwargs | string;
}
