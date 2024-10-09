
// import { typeOf, childOf } from 'tslib';
// import { ArrayCallback, ArrayType } from '../../../../types/utils.js';

// class ManagerError extends Error {

//     manager: Manager;
    
//     constructor(manager: Manager, message: string) {
//         super(message);

//         this.manager = manager;
//         this.name = Object.getPrototypeOf(this).name;
//     }
// }

// class MissingPrimaryPropertyError extends ManagerError {

//     constructor(manager: Manager, key: string) {
//         const message = `Undefined primary property: ${key}`;
        
//         super(manager, message);
//     }
// }

// class ManagerItemError extends ManagerError {

//     constructor(manager: Manager, message: string) {
//         super(manager, message);
//     }
// }

// class MissingUniqueKeyError extends ManagerItemError {

//     constructor(manager: Manager, item: any) {
//         super(manager, `Missing unique key`);
//     }
// }

// class MissingUniqueValueError extends ManagerItemError {

//     constructor(manager: Manager, item: any) {
//         super(manager, `Missing unique vaue`);
//     }
// }

// class DuplicateItemError extends ManagerError {

//     constructor(manager: Manager, name: string) {
//         super(manager, `Attempt to duplicate item "${name}"`);
//     }
// }

// type ManagerPrimaryKeys<M extends Manager> = M['options']['pkeys'];
// type ManagerItemArray<M extends Manager> = Array<ArrayType<M['options']['creators']>>;

// type ManagerOptions = {
//     pkeys: string[];
//     creators: Array<typeof ManagerItem>;
// }

// type ManagerItemOptions<M extends Manager> = { [key: string]: any } & {
//     [K in keyof ManagerPrimaryKeys<M>]: any
// }

// class ManagerItem {

//     static options: { [key: string]: any };

//     manager: Manager;
//     options: { [key: string]: any };

//     constructor(manager: Manager, options: { [key: string]: any }) {
//         try {
//             this.manager = manager;
//             this.options = options;

//         } catch(err) { throw err; }
//     }
// }

// type ManagerCallback = ArrayCallback<{ [key: string]: any }>;
// type ManagerItemCreation<M extends Manager, I extends typeof ManagerItem> = { builder?: I } & ManagerItemOptions<M>;

// class Manager {

//     protected items: ManagerItemArray<this>;
//     options: ManagerOptions;

//     constructor(options: ManagerOptions) {
//         try {            
//             const { creators, pkeys } = options;

//             this.items = [];

//             this.options = {
//                 pkeys: typeof pkeys === 'string' ? [ pkeys ] : pkeys,
//                 creators: creators,
//             }

//         } catch(err) { throw err; }
//     }

//     get pkeys() {
//         try {
//             const { options } = this;

//             return options.pkeys;

//         } catch(err) { throw err; }
//     }

//     get creators() {
//         try {
//             const { options } = this;

//             return options.creators;

//         } catch(err) { throw err; }
//     }

//     get length() {
//         try {
//             const { items } = this;

//             return items.length;

//         } catch(err) { throw err; }
//     }

//     getItemCreator(name: string) {
//         try {
//             const { options: { creators } } = this;
//             const finder = (t: typeof ManagerItem) => t.name === name;

//             return creators.find(finder);

//         } catch(err) { throw err; }
//     }
    
//     checkPrimaries(object: { [key: string]: any }) {
//         try {
//             const { options: { pkeys } } = this;

//             for (const key of pkeys) {
//                 const value = (object as any)[key];

//                 if (value === undefined) {
//                     throw new MissingPrimaryPropertyError(this, key);
//                 }
//             }

//             return true;

//         } catch(err) { throw err; }
//     }
    
//     match(item: { [key: string]: any }, query: { [key: string]: any }) {
//         try {
//             if (this.check(item) && this.check(query)) {
//                 const keys = Object.keys(query);

//                 let match = true;

//                 for (const key of keys) {
//                     const value = (item as any)[key];

//                     if ((query as any)[key] !== value) match = false;
//                 }

//                 if (match === true) return item;
//             }

//         } catch(err) { throw err; }
//     }

//     create<I extends typeof ManagerItem>(options: ManagerItemCreation<this, I>, add: boolean = true) {
//         try {
//             const { ukey } = this;

//             if (!(options as any)[ukey]) {
//                 throw new MissingUniqueKeyError(this, options);
//             }

//             const { creator } = options;
//             delete (options as any).creator;

//             const item = new creator(this, options as Omit<typeof options, 'creator'>);

//             return add ? this.add(item) : item;

//         } catch(err) { throw err; }
//     }

//     add<I extends ManagerItem>(item: I) {
//         try {
//             const { ukey } = this;
//             const uvalue = (item as any)[ukey];

//             if (!uvalue) throw new MissingUniqueValueError(this, item);

//             const found = this.find(uvalue);
//             if (found) throw new DuplicateItemError(this, (found as any)[ukey]);

//             this.items.push(item);

//             return item;

//         } catch(err) { throw err; }
//     }

//     find(query: ManagerCallback | { [key: string]: any }) {
//         try {
//             const { items } = this;

//             if (typeof query === 'function') {
//                 return items.find(query as ManagerCallback);
//             }

//             for (const item of items) {
//                 if (this.match(item, query)) return item;
//             }


//         } catch(err) {
//             if (err instanceof MissingMatchPropertyError) return;

//             throw err;
//         }
//     }

//     filter(query: ManagerCallback | { [key: string]: any }) {
//         const { items } = this;
//         const results: any[] = [];
        
//         if (typeof query === 'function') {
//             return items.filter(query as ManagerCallback);
//         }

//         try {
//             for (const item of items) {
//                 if (this.match(item, query)) results.push(item);
//             }

//         } catch(err) {
//             if (!(err instanceof MissingMatchPropertyError)) {
//                 throw err;
//             }

//         } finally { return results; }
//     }

//     map(callback: ManagerCallback) {
//         try {
//             const { items } = this;
//             const results: any[] = [];

//             let i = 0;

//             for (const item of items) {
//                 const result = callback(item, i, items);

//                 results.push(result);
//             }

//             return results;

//         } catch(err) { throw err; }
//     }
// }

// export {
    
// }