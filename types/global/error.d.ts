
declare namespace Global.Error {
    type ErrorData = string | {
        message: string;

        name?: string;
        code?: number;
        reason?: string;
        details?: string;

        source?: { error?: Error, object?: object };
    }
}
