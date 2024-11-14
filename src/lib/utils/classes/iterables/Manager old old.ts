
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
import $Array = Global.Iterables.Array;

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

class ManagerModels<M extends Manager> extends ProcessObject {

    manager: M;

    protected models: Array<typeof ManagerItem> = []; 

    constructor(manager: M, ...models: Array<typeof ManagerItem>) {
        try {
            super();

            this.manager = manager;

            this.add(...models);

        } catch(err) { throw err; }
    }

    get base() {
        try {
            return this.models[0];

        } catch(err) { throw err; }
    }

    get object() {
        try {
            const { models } = this;
            const result: Global.Dict = {};

            for (const model of models) {
                result[model.name] = model;
            }

            return result;

        } catch(err) { throw err; }
    }

    get(name: string | $Array.Matcher<typeof ManagerItem>) {
        try {
            const { models } = this;

            if (typeof name == `function`) {
                const found = models.find(name);

                if (found) return found as typeof found;
            }

            const finder = (item: typeof ManagerItem) => item.name == name;
            const found = models.find(finder);

            if (found) return found as typeof found;

        } catch(err) { throw err; }
    }

    fetch(...names: Array<string> | [ $Array.Matcher<typeof ManagerItem> ]) {
        try {
            const { models } = this;
            const { length: len } = names;

            if (len == 0) return models;

            if (len == 1 && typeof names[0] == `function`) {
                return models.filter(names[0]);
            }

            const matcher = (item: typeof ManagerItem, i: number) => {
                const finder = (name: string) => name == item.name;
                
                return (names as Array<string>).find(finder);
            }

            return models.filter(matcher);

        } catch(err) { throw err; }
    }

    add(...models: Array<typeof ManagerItem>) {
        try {
            this.models.push(...models);

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

type ManagerOptions = {
    name?: string;
    pkey: [ string, any ];
    models: Array<any>;
}

class Manager extends ProcessObject {

    name!: string;
    pkey: [ string, object ];

    models: ManagerModels<this>;
    protected items: ManagerItemsList<this>;

    constructor(options: ManagerOptions) {
        try {
            super();

            const { name, pkey, models } = options;

            this.name = name ?? makerOf(this).name;
            this.pkey = pkey;

            this.models = new ManagerModels(this, ...models);
            this.items = new ManagerItemsList(this);

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

    async create(modelName: string, kwargs: Dict) {
        try {
            const { models, items } = this;

            const name = modelName ?? models.base?.name;

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

            return new maker(this, kwargs) as any;

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

    ManagerModels,

    ManagerItem, ManagerItemError,

    // ManagerError, ManagerErrorData,
    // ManagerItemError, DuplicateItemError,
}
