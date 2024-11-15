
// import { njsp, ProcessObject, ProcessError } from '../../../../../lib/core/njsp.js';

import { Print } from '../../../../../lib/utils/functions/print.js';

// import {
//     Manager, ManagerError, type ManagerOptions,
//     ManagerItem, ManagerItemError,
// } from '../../../../../lib/utils/classes/iterables/Manager.js';


import * as $Manager from '../../../../../lib/utils/classes/iterables/Manager.js';

import { ProcessObject } from '../../../../../lib/njsp/Process.js';

class MoneyFlow extends ProcessObject {

    // wallet!: Wallet;

    label!: string;
    amount: number;

    constructor(label: string, amount: number) {
        try {
            super();

            // this.label = label;
            this.amount = amount;

        } catch(err) { throw err; }
    }

    async init(...args: [ label: string ]) {
        try {
            const [ label ] = args;

            this.label = label;

            return this;

        } catch(err) { throw err; }
    }
}

class Incoming extends MoneyFlow {

    // wallet!: Wallet;

    declare label: string;
    declare amount: number;

    constructor(label: string, amount: number) {
        try {
            super(label, amount);

        } catch(err) { throw err; }
    }
}

class Outcoming extends MoneyFlow {

    // wallet!: Wallet;

    declare label: string;
    declare amount: number;

    constructor(label: string, amount: number) {
        try {
            super(label, amount * -1);

        } catch(err) { throw err; }
    }
}

class Waste extends Outcoming {

    // wallet!: Wallet;

    declare label: string;
    declare amount: number;

    lost?: number;

    constructor(label: string, amount: number, lost?: number) {
        try {
            label += ' (wasted)';

            super(label, amount);

            this.lost = lost;

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

const models = { MoneyFlow, Incoming, Outcoming, Waste };

class Wallet extends $Manager.Manager<typeof models> {

    constructor() {
        try {
            super(models, [ `label`, '' ]);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

async function test() {
    try {
        const wallet = new Wallet();

        const aah = await wallet.create(`Incoming`, `AAH`, 1016.05);
        const cbd = await wallet.create(`Outcoming`, `CBD`, 20);
        const tabac = await wallet.create(`Waste`, `Tabac`, 17.4, 2.6);

        Print.titled(`Wallet`, wallet).br();

        for (const flow of [ aah, cbd, tabac ]) {
            const { label, amount, lost, meta } = flow as any;

            let lostStr = meta.name == `Waste` && lost ? `\n → Lost: ${lost}€` : ``;

            Print.titled(`${meta.name}: "${label}"`, ` → Amount: ${amount}€`, lostStr);
            Print.br();
        }

        async function duplicate() {
            const cbd2 = await wallet.create(`Outcoming`, `CBD`, 12.9);	// Error: Duplicate key
            const { label, amount, lost, meta } = cbd2 as any;
            let lostStr = meta.name == `Waste` && lost ? `\n → Lost: ${lost}€` : ``;
            Print.titled(`${meta.name}: "${label}"`, ` → Amount: ${amount}€`, lostStr);
            Print.br();
        }

        const got = wallet.find((n: any) => n.label == `CBD`);
        Print(got?.label).br();

        const [ CBD, Zebi, AAH ] = wallet.fetch(`CBD`, `Zebi`, `AAH`);

        Print(CBD?.amount)
        Print(AAH?.amount).br();
        Print(Zebi?.amount).br();

        // for (const flow of wallet) {
        //     const { label, amount, lost, meta } = flow as any;

        //     let lostStr = meta.name == `Waste` && lost ? `\n → Lost: ${lost}€` : ``;

        //     Print.titled(`${meta.name}: "${label}"`, ` → Amount: ${amount}€`, lostStr);
        //     Print.br();
        // }

    } catch(err) { throw err; }
}

/// -------------------------------- ///

export { test }
