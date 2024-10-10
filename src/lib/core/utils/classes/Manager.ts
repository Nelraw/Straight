
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError, ErrorData } from '../../Process.js';

/// -------------------------------- ///

type ManagerErrorData<M extends Manager | typeof Manager> = ErrorData & {
    manager: M;
}

class ManagerError<M extends Manager | typeof Manager> extends ProcessError {

    /// -------------------------------- ///

    declare readonly $data: ManagerErrorData<M>;

    /// -------------------------------- ///

    declare manager: M;

    constructor(data: ManagerErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

}

type ManagerItemErrorData<M extends Manager> = ErrorData & {
    manager: M, item?: ManagerItem;
}

class ManagerItemError<M extends Manager> extends ManagerError<M> {

    /// -------------------------------- ///

    declare readonly $data: ManagerItemErrorData<M>;

    /// -------------------------------- ///

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

class ManagerItem extends ProcessObject {

    declare manager: Manager;
    
    constructor(manager: Manager, data: { [key: string]: any }) {
        try {
            super({ ...{ manager }, ...data });

        } catch(err) { throw err; }
    }
}

// type ManagerModelNames<M extends Manager> = Exclude<keyof M['models'], 'get' | 'set' | keyof ProcessObject>;

// type ManagerItemModels<M extends Manager> = M['models'] extends infer Models
//     ? Models extends { [K in ManagerModelNames<M>]: typeof ManagerItem } ? Models : never
//     : never;

// type ManagerItemModel<M extends Manager, N extends ManagerModelNames<M>> = M['models'][N] extends infer Model
//     ? Model extends typeof ManagerItem ? Model : never
//     : never;

type ManagerItemModel<M extends Manager, N extends string> = M['models'][N];

// type ManagerItemModel<M extends Manager, N extends keyof ManagerItemModels<M>> = ManagerItemModels<M>[N] extends infer Model
//     ? Model extends typeof ManagerItem ? Model : never
//     : never;

// type ManagerItemModel<M extends Manager, N extends keyof ManagerItemModels<M>> = M['models'][N];

type ManagerItemKwargs<M extends Manager, N extends string> = ManagerItemModel<M, N> extends infer Model
    ? Model extends typeof ManagerItem ? ConstructorParameters<Model>[1] : never
    : never;

type ManagerItemCreation<M extends Manager, N extends string> = {
    model: ManagerItemModel<M, N>;
    kwargs: ManagerItemKwargs<M, N>;
}

class ManagerItemsMapError<M extends Manager> extends ManagerError<M> {

    constructor(data: ManagerErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }
}

class ManagerItemsMap<M extends Manager> extends Map<M['config']['key'], Global.Iterables.Values<M['config']['models']>> {

    declare manager: M;

    constructor(options: { manager: M }) {
        const { manager } = options;

        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }
}

class ManagerModelsHandlerError<M extends typeof Manager> extends ManagerError<M> {
    
    constructor(data: ManagerErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }
}

class ManagerModelsHandler<M extends typeof Manager> extends ProcessObject {

    declare manager: M;
    protected models: Global.Dict<typeof ManagerItem>;

    constructor(manager: M) {
        try {
            super({ manager });

            this.models = {};

            const { config : { models } } = manager;
            
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

        for (const [ name, model ] of Object.entries(models)) {
            const match = callback(name);

            if (match) results.push(model);
        }

        return results;
    }

    set(adding: typeof ManagerItem | Array<typeof ManagerItem>) {
        try {
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
            }

        } catch(err) { throw err; }
    }
}

type ManagerConfig = {
    primary: { key: string; type: string | number };
    models: Array<typeof ManagerItem>;
}

type ManagerOptions = {
    config?: ManagerConfig;
}

class Manager extends ProcessObject {

    static config: ManagerConfig;

    protected static _models: any;

    static get models(): Global.Dict<typeof ManagerItem | ((...args: any[]) => any)> {
        try {
            if (!this._models) this._models = new ManagerModelsHandler(this);

            const { _models } = this;
            const { get, set } = _models;
            const models: Global.Dict = {};

            const define = (k: string, v: any, e: boolean) => {
                if (k == 'get' || k == 'set') v = v.bind(_models);
                
                Object.defineProperty(models, k, { value: v, enumerable: e });
            }

            for (const fn of [ get, set ]) define(fn.name, fn, false);
            for (const model of models.get()) define(model.name, model, true);

            return models;

        } catch(err) { throw err; }
    }

    static set models(models: typeof ManagerItem | Array<typeof ManagerItem>) {
        try {
            if (!this._models) this._models = new ManagerModelsHandler(this);

            this._models.set(models);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    protected readonly items: ManagerItemsMap<this>;

    constructor(options?: ManagerOptions) {
        try {
            super(options);

            this.items = new ManagerItemsMap({ manager: this });

            const manager = this;

            const { maker, primary } = this;
            const { key, type } = primary;

            const message = `Missing primary key or type.`;

            if (key && type) maker.config.primary = { key, type };
            else maker.config ??= (options as ManagerOptions)?.config;

            if (!this.primary.key || !this.primary.type) {
                throw new ManagerError({ manager, message });
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get config() { return this.maker.config; }
    get primary() { return this.maker.config.primary; }

    get models(): any { return this.maker.models; }
    set models(models: typeof ManagerItem | Array<typeof ManagerItem>) {
        try { this.maker.models.set(models); }
        catch(err) { throw err; }
    }

    async create<N extends string>(modelName: N, kwargs: ManagerItemKwargs<this, N>) {
        try {
            const [ model ] = this.models.get(modelName);

            return new model(this, kwargs);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerItem,

    ManagerError, ManagerErrorData,
    ManagerItemError, DuplicateItemError,
}
