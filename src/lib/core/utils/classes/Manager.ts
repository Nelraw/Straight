
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError } from '../../Process.js';

/// -------------------------------- ///

type ManagerErrorKwargs = ProcessError['kwargs'] & {
    manager: Manager;
}

type ManagerItemErrorKwargs = ManagerErrorKwargs & {
    item: ManagerItem;
}

/// -------------------------------- ///

type ManagerItemPrimary = Global.Dict;

type ManagerItemKwargs = {
    manager: Manager;
    primary: ManagerItemPrimary;
}

type ManagerItemData = {
    // type: ManagerItem extends infer I ? I : never;
    // primary: ManagerItemPrimary;
}

type ManagerItemAdd<M extends Manager> = [
    Global.Process.UUID,
    M['model']['type'] extends infer I ? I : never
];

type ManagerOptions = {
    
}

type ManagerKwargs = {
    item: typeof ManagerItem;
    options?: ManagerOptions;
}

/// -------------------------------- ///

class ManagerError extends ProcessError {

    declare static readonly kwargs: ManagerErrorKwargs;
    declare readonly kwargs: ManagerErrorKwargs;

    constructor(kwargs: ManagerErrorKwargs) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    get manager() { return this.kwargs.manager; }

}

class ManagerItemError extends ManagerError {

    /// -------------------------------- ///

    declare static readonly kwargs: ManagerErrorKwargs;
    declare readonly kwargs: ManagerErrorKwargs;

    /// -------------------------------- ///

    constructor(kwargs: ManagerErrorKwargs) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class DuplicateItemError extends ManagerItemError {

    /// -------------------------------- ///

    constructor(kwargs: ManagerItemError['kwargs']) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class ManagerItem extends ProcessObject<ManagerItemKwargs> {
    
    static readonly Error = ManagerItemError;

    declare static readonly kwargs: ManagerItemKwargs;
    declare readonly kwargs: ManagerItemKwargs;
    
    static get primary() { return this.kwargs.primary; }

    constructor(kwargs: ManagerItemKwargs) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    get manager() { return this.kwargs.manager; }
    get primary() { return this.kwargs.primary; }
}

type ManagerItemsMapsKwargs<M extends Manager> = {
    manager: M;
    items?: ManagerItemAdd<M>[]
}

class ManagerItemsMap<M extends Manager> extends Map<Global.Process.UUID, M['model']['type']> {

    manager: M;

    constructor(kwargs: ManagerItemsMapsKwargs<M>) {
        const { manager, items } = kwargs;
        super(items ?? []);

        this.manager = manager;
    }
}

class Manager extends ProcessObject<ManagerKwargs> {
    
    static readonly Error = ManagerError;

    declare static readonly kwargs: ManagerKwargs;
    declare readonly kwargs: ManagerKwargs;

    static readonly item = ManagerItem;

    protected readonly items: ManagerItemsMap<this>;

    constructor(kwargs: ManagerKwargs) {
        try {
            super(kwargs);

            this.items = new ManagerItemsMap({ manager: this });

        } catch(err) { throw err; }
    }

    get options() { return this.kwargs.options; }

    get model() {
        const { item } = this.kwargs;

        const type = makerOf(item);
        const { primary } = item;

        return { type, primary };
    }

    method(...args: any[]) {
        try {


        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {

}
