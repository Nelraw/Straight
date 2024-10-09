
declare namespace Global.Error {
    type ErrorOptions<D extends Dict = Dict> = D & {
        message: string;

        name?: string;
        code?: number;
        reason?: string;
        details?: string;

        source?: { error?: Error, object?: object };
    }

    type ErrorArgs<D extends Dict | undefined = undefined> = string | ErrorOptions<D>;
}
