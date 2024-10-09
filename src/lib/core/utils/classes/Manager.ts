
import { v4 as uuidv4 } from 'uuid';

/// -------------------------------- ///

import { makerOf } from '../functions/meta.js';

import { ProcessObject, ProcessError } from '../../Process.js';

/// -------------------------------- ///

type ManagerErrorKwargs<M extends Manager> = Global.Error.ErrorKwargs<{
    manager: M;
}>;

/// -------------------------------- ///



/// -------------------------------- ///

class ManagerError<M extends Manager> extends ProcessError {

    /// -------------------------------- ///

    // declare readonly kwargs: ManagerErrorKwargs<I, T>;

    constructor(kwargs: ManagerErrorKwargs<M>) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get manager() { return this.kwargs.manager; }

}

class ManagerItemError<M extends Manager> extends ManagerError<M> {

    constructor(kwargs: ManagerErrorKwargs<M>) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }
}

class DuplicateItemError<M extends Manager> extends ManagerItemError<M> {

    constructor(kwargs: ManagerErrorKwargs<M>) {
        try {
            super(kwargs);

        } catch(err) { throw err; }
    }
}

type ManagerItemKwargs = {
    manager: Manager;
}

class ManagerItem extends ProcessObject {

    manager!: Manager;
    // manager!: InstanceType<typeof this['kwargs']['manager']>;
    
    constructor(kwargs: ManagerItemKwargs) {
        try {
            super(kwargs);

            this.manager = this.kwargs.manager;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    // get primary() { return this.kwargs.primary; }
}

// type ManagerItemPrimary<M extends Manager> = M['primary']; 
// type ManagerItemPrimaryKey<M extends Manager> = M['primary']['key']; 
// type ManagerItemPrimaryValue<M extends Manager> = M['primary']['value']; 

// type ManagerItemAdd<M extends Manager> = [
//     // ManagerItemPrimaryValue<M>,
//     M['primary']['value'],
//     InstanceType<M['model']> & Required<M['primary']>
// ]


type ManagerItemsMapsKwargs<M extends Manager> = {
    manager: M;
}

class ManagerItemsMap<M extends Manager> extends Map<M['primary']['value'], M['model']> {

    manager: M;

    constructor(kwargs: ManagerItemsMapsKwargs<M>) {
        const { manager } = kwargs;

        super([]);

        this.manager = manager;
    }
}


type ManagerOptions = {
    
}

type ManagerKwargs = {
    model: typeof ManagerItem;
    primary: { key: string; value: any; };

    options?: ManagerOptions;
}

class Manager extends ProcessObject {
    
    readonly primary: this['kwargs']['primary'];
    readonly model: this['kwargs']['model'];

    protected readonly items: ManagerItemsMap<this>;

    constructor(kwargs: ManagerKwargs) {
        try {
            super(kwargs);

            this.primary = kwargs.primary;
            this.model = kwargs.model;

            this.items = new ManagerItemsMap({ manager: this });

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get options() { return this.kwargs.options; }

    method(...args: any[]) {
        try {


        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {

}
