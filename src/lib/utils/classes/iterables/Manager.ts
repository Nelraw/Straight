
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';

import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';
import { List, ListError, type ListEntry, type ListEntries } from './List.js';

/// -------------------------------- ///

type Dict<T = any> = Global.Dict<T>;
type Constructor<T> = Global.Class.Constructor<T>;

/// -------------------------------- ///

import $Manager = Global.Iterables.Manager;

type ManagerModels<M extends Manager> = $Manager.ManagerModels<M>;
type ManagerModelsKwargs<M extends Manager> = $Manager.ManagerModelsKwargs<M>;
type ManagerModelKwargs<M extends Manager, N extends keyof ManagerModels<M>> = $Manager.ManagerModelsKwargs<M>[N];

type ManagerItemKwargs<M extends Manager, N extends keyof ManagerModels<M>> = Required<Record<M['pkey'], string>>
    & $Manager.ManagerModelKwargs<M, N>;

/// -------------------------------- ///

class ManagerError<M extends Manager> extends ProcessError {

    declare manager?: M;

    constructor(data: ProcessErrorData, manager?: M) {
        try {
            super(data);

            this.manager = manager;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ManagerItemError<M extends Manager> extends ManagerError<M> {

    item?: ManagerItem<M>;

    constructor(data: ProcessErrorData, manager: M, item?: ManagerItem<M>) {
        try {
            super(data, manager);

            this.item = item;

        } catch(err) { throw err; }
    }
}

class ManagerItem<M extends Manager> extends ProcessObject {

    manager: M;
    
    constructor(manager: M, kwargs: ManagerItemKwargs<M, any>) {
        try {
            super();

            const { pkey } = manager;

            // if (!(kwargs as any)[pkey]) {
            //     const message = `Primary key "${pkey}" is undefined`;

            //     throw new ManagerItemError({ message }, manager);
            // }

            // (this as any).manager = manager;
            this.manager = manager;

            Object.defineProperty(this, 'manager', { value: manager, enumerable: false });

            (this as any)[pkey] = (kwargs as any)[pkey];

        } catch(err) { throw err; }
    }

}

/// -------------------------------- ///

class ManagerModelsListError<M extends Manager> extends ListError<string, typeof ManagerItem> {

    constructor(data: ProcessErrorData, list?: List<string, typeof ManagerItem>) {
        try {
            super(data, list);

        } catch(err) { throw err; }
    }
}

class ManagerModelsList<M extends Manager> extends List<string, typeof ManagerItem> {

    manager: M;

    constructor(manager: M) {
        try {
            super();

            this.manager = manager;

        } catch(err) { throw err; }
    }

    protected get models() { return this.list; }

    get object() {
        try {
            const { values: models } = this;
            const result: Global.Dict = {};

            for (const model of models) {
                result[model.name] = model;
            }

            return result;

        } catch(err) { throw err; }
    }

    get primary() {
        try {
            const { first } = this;

            return (first ?? [])[1];

        } catch(err) { throw err; }
    }

    add(...models: Array<typeof ManagerItem> | Array<[ string, typeof ManagerItem ]>) {
        try {
            models = models as Array<typeof ManagerItem>;

            for (const model of models) {
                super.add([ model.name, model ]);
            }

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

class ManagerItemsListError<M extends Manager> extends ListError<string, ManagerItem<M>> {

    constructor(data: ProcessErrorData, list?: List<string, ManagerItem<M>>) {
        try {
            super(data, list);

        } catch(err) { throw err; }
    }
}

class ManagerItemsList<M extends Manager> extends List<string, ManagerItem<M>> {

    manager: M;

    constructor(manager: M) {
        try {
            super();

            this.manager = manager;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    protected get models() { return this.list; }
}

/// -------------------------------- ///

type ManagerOptions = {
    pkey?: string;
    models: Array<any>;
}

class Manager extends ProcessObject {

    pkey!: string;

    protected models: ManagerModelsList<this> = new ManagerModelsList(this);
    protected items: ManagerItemsList<this> = new ManagerItemsList(this);

    constructor(options: ManagerOptions) {
        try {
            super();

            const { pkey, models } = options;

            if (pkey) this.pkey = pkey;

            this.models.add(...models);

            if (this.pkey === undefined) {
                const message = 'Manager item primary key is undefined';

                throw new ManagerError({ manager: this, message });
            }

            if (Object.keys(this.models).length === 0) {
                const message = 'No any defined model';

                throw new ManagerError({ manager: this, message });
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    async create<N extends keyof ManagerModels<this>>(modelName: N, kwargs: ManagerItemKwargs<this, N>) {
        try {
            const { models, items } = this;

            const name = modelName ?? models.primary?.name;

            if (!name) {
                const message = `No model name provided`;

                throw new ManagerError({ manager: this, message });
            }

            const maker = models.get(name as string);

            if (!maker) {
                const message = name === undefined
                    ? `No any defined model`
                    : `Invalid model name "${name as string}"`;

                throw new ManagerError({ manager: this, message });
            }

            return new maker(this, kwargs);

            // const [ pkey, ptype ] = primary;
            // const prim = (kwargs ?? {})[pkey];

            // if (!prim) {
            //     const message = `Primary key "${pkey}" is undefined`;

            //     throw new ManagerItemError({ manager: this, message });
            // } else {
            //     const callback = (i: ManagerItem) => (i as any)[pkey] === prim;

            //     if (this.items.find(callback)) {
            //         const message = `Item with primary key "${pkey}" already exists`;

            //         throw new DuplicateItemError({ manager: this, message });
            //     } else {
            //         const types = [ makerOf(prim), makerOf(ptype) ];

            //         if (!childOf(prim, primary[1])) {
            //             const txt = `${types[0].name} instead of ${types[1].name}`;
            //             const message = `Primary value "${pkey}" is ${txt}`;

            //             throw new ManagerItemError({ manager: this, message });
            //         }
            //     }
            // }

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerError, type ManagerOptions,

    ManagerItem, ManagerItemError,

    // ManagerError, ManagerErrorData,
    // ManagerItemError, DuplicateItemError,
}
