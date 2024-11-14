
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';

import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';
import { List, ListError, type ListEntry, type ListEntries } from './List.js';

/// -------------------------------- ///

type Dict<T = any> = Global.Dict<T>;

import $Class = Global.Class;
type Constructor<T> = $Class.Constructor<T>;
type Name<T> = $Class.Constructor<T>;

/// -------------------------------- ///

import $Manager = Global.Iterables.Manager;

// type ManagerModels<M extends Manager> = $Manager.ManagerModels<M>;
// type ManagerModelsKwargs<M extends Manager> = $Manager.ManagerModelsKwargs<M>;
// type ManagerModelKwargs<M extends Manager, N extends keyof ManagerModels<M>> = $Manager.ManagerModelKwargs<M, N>;

// type ManagerItemKwargs<M extends Manager, N extends keyof ManagerModels<M>> = Required<Record<M['pkey'], string>>
//     & ManagerModelKwargs<M, N>;

// type ManagerItemKwargs<M extends Manager, N extends keyof ManagerModels<M>> = Required<Record<M['pkey'], string>>
//     & ManagerModelKwargs<M, N>;

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
    
    constructor(manager: M, kwargs: Global.Dict) {
        try {
            super();

            const { pkey: [ pkey, pvalue ] } = manager;

            const kwargsPrimary = (kwargs as any)[pkey];

            if (!kwargsPrimary) {
                const message = `Primary key "${pkey}" is undefined`;

                throw new ManagerItemError({ message }, manager);
            }

            if (typeof pvalue !== typeof kwargsPrimary) {
                const message = `Invalid primary value type ("${pkey}")`;

                throw new ManagerItemError({ message }, manager);
            }

            this.manager = manager;

            Object.assign(this, { ...kwargs });

        } catch(err) { throw err; }
    }

}

/// -------------------------------- ///

// export type ManagerItemDataTuple<M extends Manager, N extends string, I extends typeof ManagerItem<M>> = [
//     N, I, ConstructorParameters<I>[1] & Required<Record<M['pkey'], string>>
// ];

// export type ManagerItemData<M extends Manager, N extends string, I extends typeof ManagerItem<M>> = ManagerItemDataTuple<M, N, I> extends
//     [ infer N, infer I, infer K ] ? { name: N, model: I, kwargs: K } : never;

// export type ManagerModels<M extends Manager, I extends typeof ManagerItem<M>> = Array<ManagerItemDataTuple<M, string, I>>;

// export type ManagerModelNames<T extends any[]> = T[number][0];
// export type ManagerModelMakers<T extends any[]> = T[number][1];
// export type ManagerModelKwargs<T extends any[]> = T[number][2];

// class ManagerModelsListError<M extends Manager> extends ListError<string, typeof ManagerItem> {

//     constructor(data: ProcessErrorData, list?: List<string, typeof ManagerItem>) {
//         try {
//             super(data, list);

//         } catch(err) { throw err; }
//     }
// }

class ManagerModelsList<M extends Manager> extends List<string, typeof ManagerItem> {

    manager: M;

    constructor(manager: M) {
        try {
            super();

            this.manager = manager;

        } catch(err) { throw err; }
    }

    protected get models() { return this.list; }

    get test() { return Array.from(this.list.values()) }

    get types() {
        try {
            const { values: models } = this;
            const result: Global.Dict<typeof ManagerItem> = {};

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


/// -------------------------------- ///

// export type ManagerModelsOptions<M extends Manager, N extends string, I extends typeof ManagerItem<M>> = Array<ManagerItemDataTuple<M, N, I>>;

// export type ManagerModelsTuple = [
//     ManagerItemDataTuple<Manager, 'ManagerItem', typeof ManagerItem>
// ];

/// -------------------------------- ///

type ManagerModelKwargs<M extends Manager, N extends string> = ConstructorParameters<M[`types`][N]>[1];
// type ManagerModelKwargs<M extends Manager, N extends string> = ConstructorParameters<M[`types`][N]>[1];

type ManagerOptions = {
    pkey?: [ string | number, any ]
    models: Array<any>;
}

class Manager extends ProcessObject {

    // data!: Array<ManagerItemData<typeof this, string, typeof ManagerItem>>;

    // data!: [
    //     ManagerItemData<typeof this, string, typeof ManagerItem>,
    //     ...Array<ManagerItemData<typeof this, string, typeof ManagerItem>>
    // ];

    // pkey!: string;
    pkey = [ `id`, '' ];

    protected _models: ManagerModelsList<this> = new ManagerModelsList(this);
    protected items: ManagerItemsList<this> = new ManagerItemsList(this);

    get types() { return this._models.types; }
    get test() { return this._models.test; }

    constructor(options: ManagerOptions) {
        try {
            super();

            const { pkey, models } = options;

            if (pkey) this.pkey = pkey;

            this._models.add(...models);

            if (this.pkey === undefined) {
                const message = 'Manager item primary key is undefined';

                throw new ManagerError({ manager: this, message });
            }

            if (Object.keys(this._models).length === 0) {
                const message = 'No any defined model';

                throw new ManagerError({ manager: this, message });
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    async create<N extends string>(modelName: N, kwargs: Dict) {
        try {
            const { _models, items } = this;

            const name = modelName ?? _models.primary?.name;

            if (!name) {
                const message = `No model name provided`;

                throw new ManagerError({ manager: this, message });
            }

            const maker = _models.get(name as string);

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
    ManagerModelKwargs,

    ManagerItem, ManagerItemError,

    // ManagerError, ManagerErrorData,
    // ManagerItemError, DuplicateItemError,
}
