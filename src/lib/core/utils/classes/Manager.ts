
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError, ErrorData } from '../../Process.js';

/// -------------------------------- ///

type ManagerErrorData<M extends Manager | typeof Manager> = ErrorData & {
    manager: M;
}

class ManagerError<M extends Manager | typeof Manager> extends ProcessError {

    declare manager: M;

    constructor(data: ManagerErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

type ManagerItemErrorData<M extends Manager> = ErrorData & {
    manager: M;
}

class ManagerItemError<M extends Manager> extends ManagerError<M> {

    declare item?: ManagerItem;

    constructor(data: ManagerItemErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }
}

class DuplicateItemError<M extends Manager> extends ManagerItemError<M> {

    constructor(data: ManagerItemErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }
}

class UnknownModelError<M extends Manager> extends ManagerError<M> {

    constructor(data: ManagerErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }
}

class ManagerItem extends ProcessObject {

    manager: Manager;
    protected kwargs: Global.Dict;
    
    constructor(manager: Manager, kwargs?: Global.Dict) {
        try {
            super();

            this.manager = manager;
            this.kwargs = kwargs ?? {};

        } catch(err) { throw err; }
    }
}

type ManagerOptions = {
    models: Array<typeof ManagerItem>;
    primary: { key: string; type: string | number };
}

class Manager extends ProcessObject {

    readonly options: ManagerOptions;

    models: this['options']['models'];
    primary: this['options']['primary'];

    protected readonly items: Array<ManagerItem>;

    constructor(options: ManagerOptions) {
        try {
            super();

            const { models, primary } = options;

            this.options = options;
            
            this.models = [];
            this.items = [];

            this.primary = primary;

            for (const model of models) this.models.push(model);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    async create(name: string, kwargs?: Global.Dict) {
        try {
            const { models } = this;
            const callback = (m: typeof ManagerItem) => m.name === name;

            const maker = models.find(callback);

            if (!maker) {
                const message = `Invalid model name "${name}"`;

                throw new UnknownModelError({ manager: this, message });
            }

            return new maker(this, kwargs);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerItem,

    ManagerError, ManagerErrorData,
    ManagerItemError, DuplicateItemError,
}
