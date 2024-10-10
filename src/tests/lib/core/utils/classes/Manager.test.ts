
import { njsp, ProcessObject, ProcessError } from '../../../../../lib/core/njsp.js';

import { Print } from '../../../../../lib/core/utils/functions/print.js';

import { Manager, ManagerError, ManagerItem, ManagerItemError } from '../../../../../lib/core/utils/classes/Manager.js';

type MoneyFlowOptions = { label: string, amount: number };

type MoneyFlowErrorData<M extends Manager> = ManagerItemError<M> & { amount?: number };

class MoneyFlowError<M extends Manager> extends ManagerItemError<M> {

    /// -------------------------------- ///

    static manager: Manager;

    /// -------------------------------- ///

    declare readonly $data: MoneyFlowErrorData<M>;

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

    constructor(manager: Wallet, options: MoneyFlowOptions) {
        try {
            super(manager, options);

        } catch(err) { throw err; }
    }

    error(data: MoneyFlowErrorData<Wallet>) {
        try {
            return new MoneyFlowError(data);

        } catch(err) { throw err; }
    }
}

class Incoming extends MoneyFlow {

    label: string = '';

    constructor(manager: Wallet, options: MoneyFlowOptions) {
        try {
            options.amount = options.amount * -1;

            super(manager, options);

        } catch(err) { throw err; }
    }
}

class Outcoming extends MoneyFlow {

    constructor(manager: Wallet, options: MoneyFlowOptions) {
        try {
            options.amount = options.amount * -1;

            super(manager, options);

        } catch(err) { throw err; }
    }
}

class Waste extends Outcoming {

    constructor(manager: Wallet, options: MoneyFlowOptions) {
        try {
            options.label = options.label + ' (wasted)';

            super(manager, options);

        } catch(err) { throw err; }
    }
}

class Wallet extends Manager {

    static config = {
        primary: { key: 'label', type: 'string' },
        models: [ Incoming, Outcoming, Waste ]
    };

    constructor() {
        try {
            const config = {
                primary: { key: 'label', type: 'string' },
                models: [ Incoming, Outcoming, Waste ]
            };

            // super({ config } );
                
            super();

        } catch(err) { throw err; }
    }
}

async function test() {
    try {
        const wallet = new Wallet();

        const [ incomming, outcomming, waste ] = wallet.models.get();

        Print.br()
            .show('wallet: ' + wallet.primary.key, wallet).br()
            .show('incomming', incomming).br()
            .show('outcomming', outcomming).br()
            .show('waste', waste).br(2);

        const wasted = await wallet.create<'zob'>('zob', { label: 'Wasted', amount: 100 });

        Print(wasted).br();

    } catch(err) { throw err; }
}

export { test, MoneyFlow, Incoming, Outcoming, Waste, Wallet }
