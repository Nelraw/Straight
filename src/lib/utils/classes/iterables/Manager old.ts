
// import { v4 as uuidv4 } from 'uuid';

// /// -------------------------------- ///

// import { makerOf, childOf } from '../../functions/meta.js';

// import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';

// /// -------------------------------- ///

// type Dict = Global.Dict;

// /// -------------------------------- ///

// class ManagerError<M extends Manager> extends ProcessError {

//     declare manager?: M;

//     constructor(data: ProcessErrorData, manager?: M) {
//         try {
//             super(data);

//             this.manager = manager;;

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///
// }

// class DuplicateModelError<M extends Manager> extends ManagerError<M> {

//     model?: typeof ManagerItem;

//     constructor(data: ProcessErrorData, manager?: M, model?: typeof ManagerItem) {
//         try {
//             super(data, manager);

//             this.model = model;

//         } catch(err) { throw err; }
//     }
// }

// class ManagerItemError<M extends Manager> extends ManagerError<M> {

//     item?: ManagerItem;

//     constructor(data: ProcessErrorData, item?: ManagerItem) {
//         try {
//             super(data);

//             this.item = item;

//         } catch(err) { throw err; }
//     }
// }

// class DuplicateItemError<M extends Manager> extends ManagerItemError<M> {

//     declare item: ManagerItem;

//     constructor(data: ProcessErrorData, item: ManagerItem) {
//         try {
//             super(data);

//             this.item = item;

//         } catch(err) { throw err; }
//     }
// }

// class UnknownModelError<M extends Manager> extends ManagerError<M> {

//     model?: string;

//     constructor(data: ProcessErrorData, model?: string) {
//         try {
//             super(data);

//             this.model = model;

//         } catch(err) { throw err; }
//     }
// }

// class ManagerItem extends ProcessObject {

//     manager: Manager;
//     protected kwargs: Global.Dict;
    
//     constructor(manager: Manager, kwargs?: Global.Dict) {
//         try {
//             super();

//             this.manager = manager;
//             this.kwargs = kwargs ?? {};

//         } catch(err) { throw err; }
//     }
// }

// type ManagerOptions = {
//     models: Array<typeof ManagerItem>;
//     primary: [ key: string, type: any ];
// }

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

// class Manager extends ProcessObject {

//     models: ManagerModels<this> = new ManagerModels(this);
//     primary: [ key: string, type: any ] = [ 'id', 'string' ];

//     protected readonly items: Array<ManagerItem>;

//     constructor(options: ManagerOptions) {
//         try {
//             super();

//             const { models, primary } = options;

//             if (primary) this.primary = primary;

//             this.models.add(...models);

//             const { primary: [ key, type ] } = this;

//             if (!key || !type) {
//                 const message = 'Primary key is undefined';

//                 throw new ManagerError({ manager: this, message });
//             }

//             if (this.models.lenght === 0) {
//                 const message = 'No any defined model';

//                 throw new ManagerError({ manager: this, message });
//             }

//             this.items = [];

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

//     async create(model?: { model?: string, kwargs?: Global.Dict }) {
//         try {
//             const { models, primary } = this;
//             const { model: name, kwargs } = model ?? {};

//             const maker = models.get(name ?? models.at(0).name);

//             if (!maker) {
//                 const message = name === undefined
//                     ? `No any defined model`
//                     : `Invalid model name "${name}"`;

//                 throw new UnknownModelError({ manager: this, message });
//             }

//             const [ pkey, ptype ] = primary;
//             const prim = (kwargs ?? {})[pkey];

//             if (!prim) {
//                 const message = `Primary key "${pkey}" is undefined`;

//                 throw new ManagerItemError({ manager: this, message });
//             } else {
//                 const callback = (i: ManagerItem) => (i as any)[pkey] === prim;

//                 if (this.items.find(callback)) {
//                     const message = `Item with primary key "${pkey}" already exists`;

//                     throw new DuplicateItemError({ manager: this, message });
//                 } else {
//                     const types = [ makerOf(prim), makerOf(ptype) ];

//                     if (!childOf(prim, primary[1])) {
//                         const txt = `${types[0].name} instead of ${types[1].name}`;
//                         const message = `Primary value "${pkey}" is ${txt}`;

//                         throw new ManagerItemError({ manager: this, message });
//                     }
//                 }
//             }

//             return new maker(this, kwargs);

//         } catch(err) { throw err; }
//     }
// }

// /// -------------------------------- ///

// export {
//     Manager, type ManagerOptions,
//     ManagerItem,

//     ManagerError, ManagerErrorData,
//     ManagerItemError, DuplicateItemError,
// }
