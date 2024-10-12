
declare namespace Global.Error {
    type ErrorData<D extends Global.Dict = Global.Dict> = string | (D & {
        message: string;

        name?: string;
        code?: number;
        reason?: string;
        details?: string;

        source?: { object?: object, error?: Error };
    })
}
