
// import { njsp, ProcessObject, ProcessError } from '../../../../../lib/core/njsp.js';

import { Print } from '../../../../../lib/utils/functions/print.js';

import { Manager, ManagerError, type ManagerOptions, ManagerItem, ManagerItemError } from '../../../../../lib/utils/classes/iterables/Manager.js';

class MoneyFlowError<M extends Manager> extends ManagerItemError<M> {

    static manager: Manager;

    /// -------------------------------- ///

    constructor(data: Global.Error.ErrorData, manager: M) {
        try {
            super(data, manager);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

}

type MoneyFlowKwargs = { label: string; amount: number; }; 

class MoneyFlow extends ManagerItem<Wallet> {

    declare label: string;
    declare amount: number;

    constructor(manager: Wallet, kwargs: MoneyFlowKwargs) {
        try {
            super(manager, kwargs);

            this.amount = kwargs.amount;

        } catch(err) { throw err; }
    }
}

class Incoming extends MoneyFlow {

    label: string = '';

    constructor(manager: Wallet, kwargs: MoneyFlowKwargs) {
        try {
            super(manager, kwargs);

        } catch(err) { throw err; }
    }
}

class Outcoming extends MoneyFlow {

    constructor(manager: Wallet, kwargs: MoneyFlowKwargs) {
        try {
            kwargs.amount = kwargs.amount * -1;

            super(manager, kwargs);

        } catch(err) { throw err; }
    }
}

class Waste extends Outcoming {

    constructor(manager: Wallet, kwargs: MoneyFlowKwargs) {
        try {
            kwargs.label = kwargs.label + ' (wasted)';

            super(manager, kwargs);

        } catch(err) { throw err; }
    }
}

class Wallet extends Manager {

    declare pkey: 'label';

    constructor() {
        try {
            const options = {
                pkey: 'label',
                models: [ MoneyFlow, Incoming, Outcoming, Waste ]
            };
                
            super(options);

        } catch(err) { throw err; }
    }
}

async function test() {
    try {
        const wallet = new Wallet();

        const model = 'Outcoming';
        const kwargs = { label: 'Test', amount: 100 };

        const outcoming = await wallet.create<'Outcoming'>(model, kwargs);

        Print(outcoming).br();

    } catch(err) { throw err; }
}

export { test, MoneyFlow, Incoming, Outcoming, Waste, Wallet }
