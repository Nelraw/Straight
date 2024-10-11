
import { njsp, ProcessObject, ProcessError } from '../../../../../lib/core/njsp.js';

import { Print } from '../../../../../lib/core/utils/functions/print.js';

import { Manager, ManagerError, ManagerItem, ManagerItemError } from '../../../../../lib/core/utils/classes/Manager.js';

type MoneyFlowKwargs = { label: string, amount: number };

type MoneyFlowErrorData<M extends Manager> = ManagerItemError<M> & { amount?: number };

class MoneyFlowError<M extends Manager> extends ManagerItemError<M> {

    static manager: Manager;

    /// -------------------------------- ///

    constructor(data: MoneyFlowErrorData<M>) {
        try {
            super(data);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

}

class MoneyFlow extends ManagerItem {

    declare label: string;
    declare amount: number;

    declare kwargs: MoneyFlowKwargs;

    constructor(manager: Wallet, kwargs: MoneyFlowKwargs) {
        try {
            super(manager, kwargs);

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

    constructor() {
        try {
            const config = {
                primary: [ 'label', 'string' ] as Manager['primary'],
                models: [ Incoming, Outcoming, Waste ]
            };
                
            super(config);

        } catch(err) { throw err; }
    }
}

async function test() {
    try {
        const wallet = new Wallet();

        const model = 'Outcoming';
        const kwargs = { amount: 100 };

        const outcoming = await wallet.create({ model, kwargs });

        Print(outcoming).br();

    } catch(err) { throw err; }
}

export { test, MoneyFlow, Incoming, Outcoming, Waste, Wallet }
