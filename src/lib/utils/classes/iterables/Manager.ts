
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';

import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';
import { List, ListError, type ListEntry, type ListEntries } from './List.js';

/// -------------------------------- ///

type Dict<T = any> = Global.Dict<T>;

import $Class = Global.Class;
type Constructor<T> = $Class.Constructor<T>;

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
type ManagerItem<M extends Manager<any>, N extends ManagerModelNames<M>> = InstanceType<ManagerModel<M, N>>;

type ManagerModelParameters<M extends Manager<any>, N extends ManagerModelNames<M>> = ConstructorParameters<ManagerModel<M, N>>

type ManagerModelCreation<M extends Manager<any>, N extends ManagerModelNames<M>> = [ N, ...ManagerModelParameters<M, N> ];

type ManagerMatcher<M extends Manager<any>, N extends ManagerModelNames<M>> = (item: ManagerItem<M, N>, i?: number, arr?: ManagerItem<M, N>[]) => ManagerItem<M, N> | undefined;
type ManagerFinder<M extends Manager<any>, N extends ManagerModelNames<M>> = M[`indexer`][1] | ManagerMatcher<M, N>
type ManagerFetcher<M extends Manager<any>, N extends ManagerModelNames<M>> = Array<M[`indexer`][1]> | [ ManagerMatcher<M, N> ];

class Manager<Models> extends ProcessObject {

    /// -------------------------------- ///

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

            name ??= this.maker.name.replace(`Manager`) as string;

            this.name = name.toLowerCase();
            this.indexer = indexer;

            this.models = models;
            this.items = new ManagerItemsHandler(this);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    getModel<N extends ManagerModelNames<this>>(name: N) {
        try {
            const { models } = this;
            const model = models[name];
            
            return model;

        } catch(err) { throw err; }
    }

    find<N extends ManagerModelNames<this>>(index: ManagerFinder<this, N>) {
        try {
            const { items, indexer: [ ikey, ivalue ] } = this;

            type Item = ManagerItem<this, N>;

            if (typeof index === `function`) {
                const values = items.values as Array<Item>;

                return values.find(index);
            }

            if (typeof index !== typeof ivalue) {
                throw new ManagerItemError(`Invalid indexer value type`, this);
            }

            const got = items.get(index);

            if (got) return got as Item;

        } catch(err) { throw err; }
    }

    fetch<N extends ManagerModelNames<this>>(...indexes: ManagerFetcher<this, N>) {
        try {
            const { items, indexer: [ ikey, ivalue ] } = this;

            type Item = ManagerItem<this, N>;

            if (typeof indexes[0] === `function`) {
                const values = items.values as Item[];

                return values.filter(indexes[0]);
            }

            const results: Array<Item | undefined> = [];

            for (const index of indexes) {
                if (typeof index !== typeof ivalue) {
                    throw new ManagerItemError(`Invalid indexer value type`, this);
                }

                const got = this.find(index);

                results.push(got);
            }

            return results;

        } catch(err) { throw err; }
    }

    async create<N extends ManagerModelNames<this>>(...args: [ N, ...ManagerModelParameters<this, N> ]) {
        try {
            const { items, indexer: [ ikey, ivalue ] } = this;
            const [ modelName, ...rest ] = args;

            const maker = this.getModel(modelName);
            const inst = new (maker as any)(...rest);

            Object.defineProperty(inst, this.name, { value: this });

            if (typeof (inst as any).init == `function`) {
                await (async () => (inst as any).init(...rest))();
            }

            const index = (inst as any)[ikey];

            if (typeof index !== typeof ivalue) {
                const message = index === undefined
                    ? `Undefined indexer ${ikey}`
                    : `Invalid indexer value type`;

                throw new ManagerItemError(message, this);
            }

            items.set(index, inst);

            return inst as ManagerItem<typeof this, N>;

        } catch(err) { throw err; }
    }

    // [Symbol.iterator]() {
    //     try {
    //         return this.items.values[Symbol.iterator]();

    //     } catch(err) { throw err; }
    // }
}

/// -------------------------------- ///

export {
    Manager, ManagerError,

    ManagerItemError,

    type ManagerModels, type ManagerModelNames,
    type ManagerModel, type ManagerItem,
    type ManagerModelParameters, type ManagerModelCreation

    // ManagerError, ManagerErrorData,
    // ManagerItemError, DuplicateItemError,
}
