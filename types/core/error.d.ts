
declare namespace Node.Error {
    type ErrorKwargs = {
        message: string;

        name?: string; code?: number;
        reason?: string; details?: string;

        source?: { error?: Error, object?: any };
    }
    
    type ErrorArgs = ErrorKwargs | string;
}
