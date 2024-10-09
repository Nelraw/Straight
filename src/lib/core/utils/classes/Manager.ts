
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
    
    constructor(options: Global.Dict) {
        try {
            super(options);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
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

class ManagerMap<M extends Manager> extends Map<M['key'], Global.Iterables.Values<M['models']>> {

    declare manager: M;

    constructor(options: { manager: M }) {
        const { manager } = options;

        super();

        this.manager = manager;
    }
}

type ManagerOptions = {
    // key: object;
    // models: Array<ManagerItemModel<object>>;
}

class Manager extends ProcessObject {
    
    declare readonly key: object;
    declare readonly models: Array<typeof ManagerItem>;

    protected readonly items: ManagerMap<this>;

    constructor(options: ManagerOptions) {
        try {
            // super({ options });
            super();

            this.items = new ManagerMap({ manager: this });

            const { models } = this;

            Object.defineProperty(models, 'get', {
                value: (...names: string[]) => {
                    if (names.length === 0) return models;
                    
                    const callback = (model: any) => names.find(n => model.name);
                    const results: { [key: string]: any } = {};

                    for (const model of models) {
                        const name = callback(model);

                        if (name) results[name] = model;
                    }

                    return results;
                }
            });

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    method(...args: any[]) {
        try {


        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Manager, ManagerItem,

    ManagerError, ManagerItemError, DuplicateItemError,
}
