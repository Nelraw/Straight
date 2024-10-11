
// import { Print } from './lib/core/utils/functions/print.js';

// import njsp from './lib/core/njsp.js';

// import { Manager, ManagerItem } from './lib/core/utils/classes/Manager.js';

// type MoneyFlowOptions = { label: string, amount: number };

// class MoneyFlow extends ManagerItem {

//     declare label: string;
//     declare amount: number;

//     constructor(manager: Wallet, options: MoneyFlowOptions) {
//         try {
//             super(manager, options);

//         } catch(err) { throw err; }
//     }
// }

// class Incoming extends MoneyFlow {

//     label: string = '';

//     constructor(manager: Wallet, options: MoneyFlowOptions) {
//         try {
//             options.amount = options.amount * -1;

//             super(manager, options);

//         } catch(err) { throw err; }
//     }
// }

// class Outcoming extends MoneyFlow {

//     constructor(manager: Wallet, options: MoneyFlowOptions) {
//         try {
//             options.amount = options.amount * -1;

//             super(manager, options);

//         } catch(err) { throw err; }
//     }
// }

// class Waste extends Outcoming {

//     constructor(manager: Wallet, options: MoneyFlowOptions) {
//         try {
//             options.label = options.label + ' (wasted)';

//             super(manager, options);

//         } catch(err) { throw err; }
//     }
// }

// class Wallet extends Manager {

//     static readonly data = {
//         primary: { key: 'label', type: '' },
//         models: [ Incoming, Outcoming, Waste ]
//     };

//     constructor() {
//         try {
//             const data = {
//                 primary: { key: 'label', type: '' },
//                 models: [ Incoming, Outcoming, Waste ]
//             };

//             // super({ data: data } );
                
//             super();

//         } catch(err) { throw err; }
//     }
// }

// const wallet = new Wallet();

// const [ incomming, outcomming, waste ] = wallet.models.get();

// Print.br()
//     .show('wallet: ' + wallet.primary.key, wallet).br()
//     .show('incomming', incomming).br()
//     .show('outcomming', outcomming).br()
//     .show('waste', waste).br(12);

// const wasted = await wallet.create<'Waste'>('Waste', { label: 'Wasted', amount: 100 });

// console.log(wasted);
