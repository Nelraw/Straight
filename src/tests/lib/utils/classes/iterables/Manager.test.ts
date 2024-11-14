
// import { njsp, ProcessObject, ProcessError } from '../../../../../lib/core/njsp.js';

import { Print } from '../../../../../lib/utils/functions/print.js';

// import {
//     Manager, ManagerError, type ManagerOptions,
//     ManagerItem, ManagerItemError,
// } from '../../../../../lib/utils/classes/iterables/Manager.js';


import * as $List from '../../../../../lib/utils/classes/iterables/List.js';
import * as $Manager from '../../../../../lib/utils/classes/iterables/Manager.js';

import { ProcessObject } from '../../../../../lib/njsp/Process.js';

// class MoneyFlowError<M extends $Manager.Manager> extends $Manager.ManagerItemError {

//     static manager: $Manager.Manager;

//     /// -------------------------------- ///

//     constructor(data: Global.Error.ErrorData, manager: M) {
//         try {
//             super(data, manager);

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

// }

type MoneyFlowKwargs = { label: string; amount: number; };

class MoneyFlow extends ProcessObject {

    declare label: string;
    declare amount: number;

    constructor(label: string, amount: number) {
        try {
            super();

            this.label = label;
            this.amount = amount;

        } catch(err) { throw err; }
    }
}

class Incoming extends MoneyFlow {

    label: string = '';

    constructor(label: string, amount: number) {
        try {
            super(label, amount);

        } catch(err) { throw err; }
    }
}

class Outcoming extends MoneyFlow {

    constructor(label: string, amount: number) {
        try {
            super(label, amount * -1);

        } catch(err) { throw err; }
    }
}

class Waste extends Outcoming {

    lost?: number;

    constructor(label: string, amount: number, lost?: number) {
        try {
            label += ' (wasted)';

            super(label, amount);

            this.lost = lost;

        } catch(err) { throw err; }
    }
}

const models = { MoneyFlow, Incoming, Outcoming, Waste };

class Wallet extends $Manager.Manager<typeof models> {

    constructor() {
        try {
            super(models, [ `label`, '' ]);

        } catch(err) { throw err; }
    }
}

async function test() {
    try {
        const wallet = new Wallet();

        type Names = $Manager.ManagerModelNames<typeof wallet>;

        const model = `Outcoming`;
        // const outcoming = await wallet.create<`${typeof model}`>('Outcoming', 'out', 100);
        const outcoming = await wallet.create('Outcoming', 'out', 100);

        Print(outcoming).br(2);

        const wasted = await wallet.create('Waste', 'wasted', 100, 50);
        // const wasted = await wallet.create<`Waste`>('Waste', 'wasted', 100, 50);

        Print(wasted).br(2);

        // Print(wallet.getModel(`Waste`))
        const got = wallet.getModel(`Waste`);
        Print(got)

        // type Names = $Manager.ManagerModelNames<typeof wallet>;
        // type Models = $Manager.ManagerModels<typeof wallet>;

        // type Out = $Manager.ManagerModel<typeof wallet, `Outcoming`>;
        // type Args = $Manager.ManagerModelParameters<typeof wallet, `Outcoming`>

    } catch(err) { throw err; }
}

// async function testing() {
//     try {
        
//         const options: HandlerOptions = {
//             items: [ Item, TestItem, TryItem, TestingItem ]
//         }
        
//         const handler = new Handler(options);

//         type X = keyof (typeof handler.items.object);
//         type Y = typeof handler.items.names;
        
//         Print(handler).br();
        
//         const item = await handler.create<`Item`>(`Item`, { id: 'zob', bits: 64 });

//         Print(item).br();

//         type Kwargs = ConstructorParameters<typeof TestItem>[1]

//         const testItem = await handler.create<`TestItem`>(`TestItem`, { id: 'zob', bits: 64 });

//         Print(testItem).br();

//     } catch(err) { throw err; }
// }


export { test }//, MoneyFlow, Incoming, Outcoming, Waste, Wallet }
// export { test, MoneyFlow, Incoming, Outcoming, Waste, Wallet }
