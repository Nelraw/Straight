
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';

import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';

/// -------------------------------- ///

type Dict = Global.Dict;
type Matcher<T> = Global.Iterables.Array.Matcher<T>;

/// -------------------------------- ///

class ListError<K extends string, O extends object> extends ProcessError {

    list?: List<K, O>;

    constructor(data: ProcessErrorData, list?: List<K, O>) {
        try {
            super(data);

            this.list = list;
            this.source = { object: list };

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class List<K extends string, O extends object> extends ProcessObject {

    protected list: Map<K, O>;

    constructor(...items: Array<[ K, O ]>) {
        try {
            super();

            this.list = new Map<K, O>(items);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    protected get array() { return Array.from(this.list); }

    get length() { return this.list.size; }

    get type() {
        try {
            const { list, array } = this;
            if (list.size > 0) return makerOf(array[0]);

        } catch(err) { throw err; }
    }

    keyOf(value: O) {
        try {
            for (const [ k, v ] of this.list) {
                if (v === value) return k;
            }

        } catch(err) { throw err; }
    }

    has(key: K) { return this.list.has(key); }

    get(key: K) {
        try {
            const { list } = this;

            if (list.has(key)) return list.get(key);

        } catch(err) { throw err; }
    }

    set(key: K, value: O): [ K, O ] {
        try {
            if (this.list.has(key)) {
                const message = `Key "${key}" already exists`;

                throw new ListError({ message }, this);
            }

            this.list.set(key, value);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    add(...items: Array<[ K, O ]>) {
        try {
            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of items) {
                const set = this.set(key, value);

                results.push(set);
            }

        } catch(err) { throw err; }
    }

    keys() { return Array.from(this.list.keys()); }
    values() { return Array.from(this.list.values()); }
    entries() { return Array.from(this.list.entries()); }

    delete(key: K | O) {
        try {
            const { list } = this;

            if (typeof key !== 'string') key = this.keyOf(key) as K;

            if (list.has(key)) return list.delete(key);

        } catch(err) { throw err; }
    }

    clear() { return this.list.clear(); }

    at(index: number) {
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] =  array[index] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    get first() {
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] = array[0] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    get last(){
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] = array[list.size - 1] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    shift() {
        try {
            const { list, array } = this;
            if (list.size === 0) return;
            
            const [ key, value ] = array[0] ?? [];

            this.delete(key);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    pop() {
        try {
            const { size } = this.list;
            if (size === 0) return;

            const [ key, value ] = this.array[size - 1] ?? [];

            this.delete(key);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    find(matcher: Matcher<[ K, O ]>) {
        try {
            const [ key, value ] = this.array.find(matcher) ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    filter(matcher: Matcher<[ K, O ]>) {
        try {
            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of this.list) {
                if (matcher([ key, value ])) {
                    results.push([ key, value ]);
                }
            }

            return results;
            // return this.array.filter(matcher);

        } catch(err) { throw err; }
    }

    [Symbol.iterator]() {
        try {
            return this.list[Symbol.iterator]();

        } catch(err) { throw err; }
    }
}

// class ManagerModels<M extends Manager> extends ProcessObject {

//     manager: M;
//     protected models: Array<typeof ManagerItem>;

//     constructor(manager: M, ...models: Array<typeof ManagerItem>) {
//         try {
//             super();

//             this.models = models;
//             this.manager = manager;

//         } catch(err) { throw err; }
//     }

//     get(name: string | typeof ManagerItem) {
//         try {
//             if (typeof name !== 'string') name = name.name;
            
//             const callback = (m: typeof ManagerItem) => m.name === name;

//             return this.models.find(callback);

//         } catch(err) { throw err; }
//     }

//     add(...models: Array<typeof ManagerItem>) {
//         try {
//             const { manager, models: mdls } = this;

//             for (const model of models) {
//                 if (mdls.find(m => m.name === model.name)) {
//                     const message = `Model "${model.name}" already exists`;

//                     throw new DuplicateModelError({ manager, message });
//                 }

//                 mdls.push(model);
//             }

//         } catch(err) { throw err; }
//     }

//     at(index: number) {
//         try {
//             return this.models[index];

//         } catch(err) { throw err; }
//     }

//     [Symbol.iterator]() {
//         try {
//             return this.models[Symbol.iterator]();

//         } catch(err) { throw err; }
//     }
// }

/// -------------------------------- ///

export { List, ListError };




// class BlackBoxError<T extends object> extends ProcessError {

//     box?: BlackBox<T>;

//     constructor(data: ProcessErrorData, box?: BlackBox<T>) {
//         try {
//             super(data);

//             this.box = box;
//             this.source = { object: box };

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

//     title(full: boolean = false) {
//         try { if (this.box) return BlackBox.title(this.box, full); }
//         catch(err) { throw err; }
//     }
// }

// class MissingBlackBoxLabelError<T extends object> extends BlackBoxError<T> {

//     constructor(box: BlackBox<T>) {
//         try {
//             const title = BlackBox.title(box, true);
//             const message = `Missing label option in ${title}`;

//             super(message, box);

//         } catch(err) { throw err; }
//     }
// }

// class MissingBlackBoxItemLabelError<T extends object> extends BlackBoxError<T> {

//     item: T;

//     constructor(box: BlackBox<T>, item: T) {
//         try {
//             const title = BlackBox.title(box);
//             const message = `Missing label in ${title} item`;

//             super(message, box);

//             this.item = item;

//         } catch(err) { throw err; }
//     }
// }

// type BlackBoxOptions<T extends object> = {
//     label: [ key: string, type: any ];
//     items?: Array<T>;
// }

// class BlackBox<T extends object> extends ProcessObject {
    
//     static title(box: BlackBox<any>, full: boolean = false) {
//         try {
//             const { maker, type } = box;
//             let title = `BlackBox "${maker.name}"`;
            
//             title = box.length === 0 ? `empty ${title}` : title;

//             return (full && type) ? `${title} of "${type.name}" items` : title;

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

//     label!: [ key: string, type: any ];
//     protected box: Array<T>;

//     constructor(...options: [ BlackBoxOptions<T> ] | Array<T>) {
//         try {
//             super();

//             const isOptionsArgs = options.length === 1
//                 && (options[0] as BlackBoxOptions<T>)?.label

//             if (isOptionsArgs) {
//                 const { label, items } = options[0] as BlackBoxOptions<T>;

//                 this.label = label;
//                 this.box = new Array<T>(...(items ?? []));

//                 return this;
//             }

//             if (!this.label) throw new MissingBlackBoxLabelError(this);

//             this.box = new Array<T>(...(options as Array<T>));

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

//     get length() { return this.box.length; }

//     get type() {
//         try { if (this.box.length > 0) return makerOf(this.box[0]); }
//         catch(err) { throw err; }
//     }

//     check(item: T) {
//         try {
//             const { label: [ key, type ] } = this;
//             const value = (item as any)[key];

//             if (value === undefined) {
//                 throw new MissingBlackBoxItemLabelError<T>(this, item);
//             }

//             return childOf(value, type) ? true : false;
            
//         } catch(err) { throw err; }
//     }

// }
