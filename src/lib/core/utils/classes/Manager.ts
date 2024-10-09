
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError, ErrorOptions, ErrorArgs } from '../../Process.js';

/// -------------------------------- ///

class ManagerError<M extends Manager | typeof Manager> extends ProcessError {

    declare manager: M;

    constructor(options: ErrorArgs<{ manager: M }>) {
        try {
            super(options);

        } catch(err) { throw err; }
    }
}

class ManagerItemError<M extends Manager> extends ManagerError<M> {

    constructor(options: ErrorArgs<{ manager: M }>) {
        try {
            super(options);

        } catch(err) { throw err; }
    }
}

class DuplicateItemError<M extends Manager> extends ManagerItemError<M> {

    constructor(options: ErrorArgs<{ manager: M }>) {
        try {
            super(options);

        } catch(err) { throw err; }
    }
}

class ManagerItem extends ProcessObject {

    declare manager: Manager;
    
    constructor(manager: Manager, options: { [key: string]: any }) {
        try {
            super({
                ...{ manager },
                ...options,
            });

        } catch(err) { throw err; }
    }
}

type ManagerItemModel<M extends Manager, N extends string> = M['models'][N];

type ManagerItemOptions<M extends Manager, N extends string> = ConstructorParameters<M['models'][N]>[1];

type ManagerItemCreation<M extends Manager, N extends string> = {
    model: ManagerItemModel<M, N>;
    args: ManagerItemOptions<M, N>;
}

class ManagerMap<M extends Manager> extends Map<M['data']['key'], Global.Iterables.Values<M['data']['models']>> {

    declare manager: M;

    constructor(options: { manager: M }) {
        const { manager } = options;

        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }
}

class ManagerModelsHandlerError<M extends typeof Manager> extends ManagerError<M> {
    
    constructor(options: ErrorArgs<{ manager: M }>) {
        try {
            super(options);

        } catch(err) { throw err; }
    }
}

class ManagerModelsHandler<M extends typeof Manager> extends ProcessObject {

    declare manager: M;
    protected models: { [key: string]: typeof ManagerItem } = {};

    constructor(manager: M) {
        try {
            super({ manager });

            const { data : { models } } = manager;
            this.set(models);

            Object.defineProperty(this, 'manager', { value: manager });

        } catch(err) { throw err; }
    }

    get(...names: string[]): Array<typeof ManagerItem> {
        const { models } = this;

        if (names.length === 0) {
            const results: Array<typeof ManagerItem> = [];

            for (const name in models) results.push(models[name])

            return results;
        }
        
        const results: Array<typeof ManagerItem> = [];
        const callback = (name: string) => names.find(n => n === name);

        for (const [ name, model ]of Object.entries(models)) {
            const match = callback(name);

            if (match) results.push(model);
        }

        return results;
    }

    set(adding: typeof ManagerItem | Array<typeof ManagerItem>) {
        const { manager, models } = this;

        if (Array.isArray(adding)) {
            for (const model of adding) this.set(model);
        }

        const model = adding as typeof ManagerItem;
        const name = model.name;

        if (models[model.name]) {
            const message = `Model "${name}" already exists.`;

            throw new ManagerModelsHandlerError({ manager, message });
        } else {
            (models as any)[name] = model;

            (this as any)[name] = model;
        }
    }
}

type ManagerData = {
    primary: { key: string, type: string | number };
    models: Array<typeof ManagerItem>;
}

type ManagerOptions = {
    data?: ManagerData;
}

class Manager extends ProcessObject {

    static readonly data: ManagerData;

    protected static _models: any;

    static get models() {
        try {
            if (!this._models) this._models = new ManagerModelsHandler(this);

            const models = this._models as any;

            for (const model of models.get()) {
                const { name } = model;

                if (!models[name]) models[name] = model;
            }

            return models;

        } catch(err) { throw err; }
    }

    static set models(models: typeof ManagerItem | Array<typeof ManagerItem>) {
        try {
            if (!this._models) this._models = new ManagerModelsHandler(this);

            this._models.set(models);

        } catch(err) { throw err; }
    }

    protected readonly items: ManagerMap<this>;

    constructor(options?: ManagerOptions) {
        try {
            super(options);

            this.items = new ManagerMap({ manager: this });

            const { maker } = this;

            const key = maker.data;

            if (!maker.data && options) {
                if (!options.data) {
                    const err = { manager: this, message: 'No data provided.' };

                    throw new ManagerError(err);
                } else {
                    const { data: { primary, models } } = options;

                    maker.data ??= { primary, models };
                }
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get data() { return this.maker.data; }
    get primary() { return this.maker.data.primary; }

    get models(): any { return this.maker.models; }
    set models(models: typeof ManagerItem | Array<typeof ManagerItem>) {
        try { this.maker.models.set(models); }
        catch(err) { throw err; }
    }

    async create<N extends string>(modelName: N, options: ManagerItemOptions<this, N>) {
        try {
            const [ model ] = this.models.get(modelName);

            return new model(this, options);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerItem,

    ManagerError, ManagerItemError, DuplicateItemError,
}
