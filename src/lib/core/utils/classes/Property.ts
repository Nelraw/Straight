
// // type PropertyDescriptorValue = { [K in keyof PropertyDescriptorMode]: PropertyDescriptorSetting };

// // type PropertyDescriptor = PropertyDescriptorValue & PropertyDescriptorOptions;

// // type PropertiesDescription = { [key: string]: PropertyDescriptor };

// /// -------------------------------- ///

// type PropertyMode = 'value' | 'get' | 'set';
// type PropertyKeyValue = [ key: string | symbol, value: any ];

// type PropertyData = [ ...PropertyKeyValue, mode?: PropertyMode ];
// // type PropertyData = [ key: string | symbol, value: any, mode?: PropertyMode ];

// type PropertyOptionsArray = [ e?: boolean, w?: boolean, c?: boolean ];

// type PropertyOptionsDict = {
//     enumerable?: boolean, e?: boolean;
//     writable?: boolean, w?: boolean;
//     configurable?: boolean, c?: boolean;
// };

// type PropertyOptions = PropertyOptionsArray | PropertyOptionsDict;

// /// -------------------------------- ///

// type DescriptorValueSetting = { value: any }
//     | { get: () => any }
//     | { set: (value: any) => void }
//     | { get: () => any; set: (value: any) => void }

// type ObjectDescriptorOptions = {
//     enumerable?: boolean;
//     writable?: boolean;
//     configurable?: boolean;
// };

// type ObjectDescription = DescriptorValueSetting & ObjectDescriptorOptions;
// type ObjectDescriptor = { [key: string]: ObjectDescription };

// /// -------------------------------- ///

// // class PropertyDescriptorOptions {
// class PropertyDescriptorOptions<O extends object> {

//     enumerable: boolean;
//     writable: boolean;
//     configurable: boolean;

//     // constructor(property: Property, options?: PropertyOptions) {
//     constructor(property: Property<O>, options?: PropertyOptions) {
//         try {
//             const { defaults } = property;
//             options ??= defaults?.options ?? ({} as PropertyOptionsDict);

//             let enm: boolean, cfg: boolean, wrt: boolean;

//             if (Array.isArray(options)) {
//                 const [ e, c, w ] = options;

//                 enm = e ?? false;
//                 cfg = c ?? false;
//                 wrt = w ?? false;
//             } else {
//                 const { enumerable, e, writable, w, configurable, c } = options;

//                 enm = e ?? enumerable  ?? false;
//                 wrt = w ?? writable ?? false;
//                 cfg = c ?? configurable ?? false;
//             }

//             this.enumerable = enm;
//             this.writable = wrt;
//             this.configurable = cfg;

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///
// }

// // class Property {
// // class Property<O extends object> {
// class Property<O extends object> {

//     defaults?: { mode?: PropertyMode; options?: PropertyOptions };

//     // object: object;
//     // object: O;

//     readonly keyval: PropertyKeyValue;

//     mode: PropertyMode;
//     options: PropertyDescriptorOptions<O>;

//     // constructor(object: object, data: PropertyData, options?: PropertyOptions) {
//     // constructor(object: O, data: PropertyData, options?: PropertyOptions) {
//     constructor(data: PropertyData, options?: PropertyOptions) {
//         try {
//             const [ key, value, mode ] = data;

//             // this.object = object;

//             this.keyval = [ key, value ];
//             this.mode = mode ?? 'value';

//             this.options = new PropertyDescriptorOptions<O>(this, options);
//             // this.options = new PropertyDescriptorOptions(this, options);

//         } catch(err) { throw err; }
//     }

//     /// -------------------------------- ///

//     get key() { return this.keyval[0]; }
//     get value() { return this.keyval[1]; }

//     get isValue() { return this.mode === 'value'; }
//     get isGetter() { return this.mode === 'get'; }
//     get isSetter() { return this.mode === 'set'; }

//     get description(): ObjectDescription {
//         try {
//             const { value, mode, options } = this;
//             const { enumerable, writable, configurable } = options;

//             const description: Global.Dict = {
//                 [mode]: value, ...{ options }
//                 // enumerable, writable, configurable
//             };

//             return description as ObjectDescription;

//         } catch(err) { throw err; }
//     }

//     get descriptor(): ObjectDescriptor {
//         try {
//             const { key, description } = this;

//             return { [key]: description };

//         } catch(err) { throw err; }
//     }
// }
