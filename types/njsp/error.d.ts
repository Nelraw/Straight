
declare namespace Global.Error {
    type ErrorData<D extends Global.Dict = Global.Dict> = string | (D & {
        message: string;

        name?: string;
    })
}
