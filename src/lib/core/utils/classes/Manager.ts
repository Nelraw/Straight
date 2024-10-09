
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError, ErrorOptions, ErrorArgs } from '../../Process.js';

/// -------------------------------- ///

class ManagerError<M extends Manager> extends ProcessError {

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

type ManagerItemModel<M extends Manager, N extends string> = M['_models'][N];

type ManagerItemOptions<M extends Manager, N extends string> = ConstructorParameters<M['_models'][N]>[1];

type ManagerItemCreation<M extends Manager, N extends string> = {
    model: ManagerItemModel<M, N>;
    args: ManagerItemOptions<M, N>;
}

// type ManagerItemModel<M> = M extends typeof ManagerItem ? M : never; 

// class ManagerModelHandler<M extends Manager> extends ProcessObject {
    
//     declare manager: M;
//     declare protected models: M;

//     constructor(options: { manager: M }) {
//         const { manager } = options;

//         super();

//         this.manager = manager;
//     }

//     /// -------------------------------- ///

//     get(key: M['key']) {
//         try {
//             return this.find(item => item.key === key);

//         } catch(err) { throw err; }
//     }

//     add(item: ManagerItemModel<typeof ManagerItem>) {
//         try {
//             if (this.includes(item)) throw new DuplicateItemError({ manager: this.manager });

//             this.push(item);

//         } catch(err) { throw err; }
//     }

//     remove(item: ManagerItemModel<typeof ManagerItem>) {
//         try {
//             const index = this.indexOf(item);

//             if (index === -1) throw new ManagerItemError({ manager: this.manager });

//             this.splice(index, 1);

//         } catch(err) { throw err; }
//     }
// }

class ManagerMap<M extends Manager> extends Map<M['data']['key'], Global.Iterables.Values<M['data']['models']>> {

    declare manager: M;

    constructor(options: { manager: M }) {
        const { manager } = options;

        super();

        Object.defineProperty(this, 'manager', { value: manager });
    }
}

class ManagerModelHandlerError<M extends Manager> extends ManagerError<M> {
    
    constructor(options: ErrorArgs<{ manager: M }>) {
        try {
            super(options);

        } catch(err) { throw err; }
    }
}

class ManagerModelHandler<M extends Manager> extends Array<typeof ManagerItem> {

    declare manager: M;
    declare makers: { [key: string]: typeof ManagerItem };

    constructor(manager: M, ...models: Array<typeof ManagerItem>) {
        try {
            super(...models);

            this.makers = {};

            const { primary: { key, type } } = manager.data;

            for (const model of models) {
                this.makers[model.name] = model;


                // let { prototype, name } = model;

                // const prop = Object.getOwnPropertyDescriptor(prototype, key);
                // const value = prop?.value ?? prop?.get?.();

                // if (!value) {
                //     const message = `${name} is missing primary key "${key}".`;

                //     throw new ManagerModelHandlerError({ manager, message });
                // } else {
                //     const types = [ makerOf(type), makerOf(value) ];
                                   
                //     if (types[0] !== types[1]) {
                //         const txt = `${types[1]} instead of ${types[0]} (key "${key}").`;
                //         const message = `${name} has invalid primary value type: ${txt}`;

                //         throw new ManagerModelHandlerError({ manager, message });
                //     }
                // }
            }

            Object.defineProperty(this, 'manager', { value: manager });

            
        } catch(err) { throw err; }
    }

    get(...names: string[]): Array<typeof ManagerItem> {
        if (names.length === 0) {
            const results: Array<typeof ManagerItem> = [];

            for (const model of this) {
                results.push(model)
            }

            return results;
        }
        
        const callback = (model: any) => names.find(n => n === model.name);
        const results: Array<typeof ManagerItem> = [];

        for (const model of this) {
            const name = callback(model);

            if (name) results.push(model);
        }

        return results;
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

    protected readonly items: ManagerMap<this>;
    declare readonly models: ManagerModelHandler<this>;
    declare readonly _models: { [key: string]: typeof ManagerItem };

    constructor(options?: ManagerOptions) {
        try {
            super(options);

            const { maker } = this;

            if (!maker.data && options) {
                if (!options.data) {
                    const err = { manager: this, message: 'No data provided.' };

                    throw new ManagerError(err);
                } else {
                    const { data: { primary, models } } = options;

                    maker.data ??= { primary, models };
                }
            }

            this.items = new ManagerMap({ manager: this });
            this.models = new ManagerModelHandler(this, ...maker.data.models);

            this._models = {};

            for (const model of this.models) {
                this._models[model.name] = model;
            }

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get data() { return this.maker.data; }
    get primary() { return this.maker.data.primary; }

    async create<N extends string>(modelName: N, options: ManagerItemOptions<this, N>) {
        try {
            console.log(modelName);
            console.log(this._models);
            console.log();

            const [ model ] = this.models.get(modelName);

            console.log(model)

            return new model(this, options);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerItem,

    ManagerError, ManagerItemError, DuplicateItemError,
}
