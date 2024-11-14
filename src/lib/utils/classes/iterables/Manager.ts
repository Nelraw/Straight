
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
import $Iterables = Global.Iterables;
import $Array = Global.Iterables.Array;

/// -------------------------------- ///

class ManagerError extends ProcessError {

    /// -------------------------------- ///

    manager?: any

    constructor(data: ProcessErrorData, manager?: any) {
        try {
            super(data);

            this.manager = manager;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ManagerItemError extends ManagerError {

    item?: any;

    constructor(data: ProcessErrorData, manager?: any, item?: any) {
        try {
            super(data, manager);

            this.item = item;

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

// class ManagerModelError extends ManagerError {

//     model?: any;

//     constructor(data: ProcessErrorData, manager?: any, model?: any) {
//         try {
//             super(data, manager);

//             this.model = model;

//         } catch(err) { throw err; }
//     }
// }

// type ManagerModels<M> = { [K in keyof M]: M[K] };
// type ManagerModelNames<M> = keyof M;

// class ManagerModelsHandler extends ProcessObject {

//     manager: any;

//     // protected models: ManagerModels = {};
//     protected models: ManagerModels<unknown>;

//     constructor(manager: any, models: ManagerModels<unknown>) {
//         try {
//             super();

//             this.manager = manager;
//             this.models = models;
//             // this.models = models as ManagerModels<typeof models>;

//             if (models) this.set(models);

//         } catch(err) { throw err; }
//     }

//     get length() { return Object.keys(this.models).length; }

//     get names() {
//         try {
//             const { models } = this;
//             const keys = Object.keys(models);
//             const names: Dict = {};

//             for (const key of keys) names[key] = key;

//             return names;

//         } catch(err) { throw err; }
//     }

//     get(name: keyof this[`names`]) {
//         try {
//             const { models } = this;

//             return models[name] as typeof models[`name`];
//             // const { models } = this;

//             // const finder = typeof name !== `function`
//             //     ? (item: any) => (item as any).name == name
//             //     : name;

//             // return models.find(finder);

//         } catch(err) { throw err; }
//     }

//     getMany(...names: Array<string>) {
//         try {
//             const { models } = this;
//             const { length: len } = names;

//             if (len == 0) return models;

//             const results: ManagerModels = {};

//             for (const name of names) {
//                 results[name] = models[name];
//             }

//             return results;
//             // const { models } = this;

//             // const finder = typeof name !== `function`
//             //     ? (item: any) => (item as any).name == name
//             //     : name;

//             // return models.find(finder);

//         } catch(err) { throw err; }
//     }
    
//     set<M>(models: ManagerModels<M>) {
//         try {
//             const { models: mdls, manager } = this;
//             const names = Object.keys(models);

//             for (const name in models) {
//                 const model = this.get(name);

//                 if (!model) this.models[name] = models[name];
//                 else {
//                     const msg = `Model "${name}" already exists.`;

//                     throw new ManagerModelError(msg, manager);
//                 }
//             }

//         } catch(err) { throw err; }
//     }

//     // fetch(...names: Array<string> | [ $Array.Matcher<any> ]) {
//     //     try {
//     //         const { models } = this;
//     //         const { length: len } = names;

//     //         if (len == 0) return models;

//     //         if (len == 1 && typeof names[0] == `function`) {
//     //             return models.filter(names[0]);
//     //         }

//     //         const matcher = (item: any) => {
//     //             const finder = (name: string) => name == (item as any).name;
                
//     //             return (names as Array<string>).find(finder);
//     //         }

//     //         return models.filter(matcher);

//     //     } catch(err) { throw err; }
//     // }
// }

/// -------------------------------- ///

class ManagerItemsListError extends ManagerError {

    constructor(data: ProcessErrorData, manager?: any) {
        try {
            super(data, manager);

        } catch(err) { throw err; }
    }
}

class ManagerItemsHandler<PKT extends string | number, Models> extends List<PKT, Extract<Models, keyof Models>> {

    manager: any;

    constructor(manager: any) {
        try {
            super();

            this.manager = manager;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    protected get items() { return this.list; }
}

/// -------------------------------- ///


/// -------------------------------- ///

type ManagerModels<M extends Manager<any>> = $Iterables.Values<M[`models`][ManagerModelNames<M>][]>;
type ManagerModelNames<M extends Manager<any>> = keyof M[`models`];

type ManagerModel<M extends Manager<any>, N extends ManagerModelNames<M>> = M[`models`][N];
type ManagerModelParameters<M extends Manager<any>, N extends ManagerModelNames<M>> = ConstructorParameters<ManagerModel<M, N>>
type ManagerModelCreation<M extends Manager<any>, N extends ManagerModelNames<M>> = [ N, ...ManagerModelParameters<M, N> ];

type ManagerOptions = {
    name?: string;
    indexer: [ string, any ];
}

class Manager<Models> extends ProcessObject {

    protected items: ManagerItemsHandler<this[`indexer`][0], Models>;

    models: Models;
    indexer: [ string, any ];
    name: string;

    constructor(models: Models, indexer: [ string, any ], name?: string) {
        try {
            super();

            if (Object.keys(models as any).length == 0) {
                throw new ManagerError(`No any defined model`, this);
            }

            name ??= this.maker.name as string;
            
            this.models = models;

            this.indexer = indexer;
            this.name = name.toLowerCase();

            this.items = new ManagerItemsHandler(this);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    async create<N extends ManagerModelNames<this>>(...args: [ N , ...ManagerModelParameters<this, N> ]) {
        try {
            const { models, indexer: [ ikey, ivalue ] } = this;

            const [ modelName, ...rest ] = args;
            const value = rest?.[0];

            const maker = (models as any)[(modelName as string)];

            if (value == undefined) {
                const message = `Undefined indexer ${ikey}`;

                throw new ManagerItemError({ manager: this, message });
            }

            if (typeof value !== typeof ivalue) {
                const message = `Invalid indexer value type`;

                throw new ManagerItemError({ manager: this, message });
            }

            const inst = new (maker as any)(...rest);

            Object.defineProperty(inst, this.name, { value: this });

            if (typeof (inst as any).init == `function`) {
                await (inst as any).init();
            }

            return inst;

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

    ManagerItemError,

    type ManagerModels, type ManagerModelNames,
    type ManagerModel, type ManagerModelParameters, type ManagerModelCreation

    // ManagerError, ManagerErrorData,
    // ManagerItemError, DuplicateItemError,
}
