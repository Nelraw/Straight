
class Nullish {

    static isNullish(value: any) {
        if (value === undefined) return Undefined;
        if (value === null) return Null;
    }

    static [Symbol.toPrimitive](hint: string) {
        if (hint === 'string') return this.name.toLowerCase();
    }
}

class Null extends Nullish {}
class Undefined extends Nullish {}

const AsyncFunction = getConstructor(async function() {});

/// -------------------------------- ///

function isConstructor(object: any) {
    if (!object) {
        if (typeof object !== 'boolean') return null;
    }

    if (typeof object === 'function') {
        const str = object?.toString();

        if (str) {
            if (str.startsWith('class')) return true;

            if (str.indexOf('function') === 0) {
                if (str.indexOf('[native code]') > -1) return true;
            }

            return false;
        }
    }
    
    return object.prototype?.constructor === object;
}

function getConstructor(object: any) {
    if (object === undefined) return Undefined;
    if (object === null) return Null;

    if (isConstructor(object)) return object;

    return Object.getPrototypeOf(object).constructor;
}

function getConstructorParent(object: any) {
    if (object == undefined) return Nullish;
    // if (object === null) return Nullish;

    const type = getConstructor(object);
    const parent = Object.getPrototypeOf(type);

    if (parent?.name == ``) return Object;

    return parent;
}

function isPrimitive(object: any, strict: boolean = false) {
    try {
        const type = getConstructor(object);
        const family = familyOf(type);

        if (family.length === 1) return Object;
        
        const checker = (type: any) => {
            const finder = (cstr: any) => cstr === type;
            const prim = [ String, Number, Boolean, Array, Function, AsyncFunction ];

            return prim.find(finder) ? true : false;
        }

        if (strict) return checker(type) ? type : undefined;

        return family.find(checker);

    } catch(error) { throw error; }
}

function familyOf(object: any) {
    const type = getConstructor(object);
    const family = [ type as typeof type ];

    if (type === Object) return family;

    let parent = getConstructorParent(type);

    while (true) {
        const skip = parent == Object || parent?.name == '';
        if (parent == null || skip) break;

        family.push(parent as typeof parent);

        parent = Object.getPrototypeOf(parent);
    }

    family.push(Object);

    return family;
}

function elderOf(object: any) {
    const family = familyOf(object);
    const { length: len } = family;

    const elder = family[len - 2];

    if (elder?.name == `Error`) {
        const ancestor = family[len - 3];

        if (ancestor?.name == `ProcessError`) {
            return family[len - 4];
        }
    }

    return elder;
}

function childOf(object: any, query: any) {
    let finder = (type: any) => type.name == query;
    const family = familyOf(object);

    if (typeof query !== `string`) {
        query = getConstructor(query);

        finder = (type: any) => type == query
    }

    return family.find(finder);
}

function typeOf(object: any, query?: any) {
    const type = getConstructor(object);

    if (query === undefined) return type;

    if (typeof query === `string`) {
        return type?.name === query ? type : undefined;
    }

    return type == getConstructor(query) ? type : undefined;
}

function makerOf(object: any) { return typeOf(object); }

async function superInit(object: any, ...iargs: any[]) {
    let result = object;
    const family = familyOf(object);

    for (const parent of family.reverse()) {
        const fn = parent?.prototype?.$init;

        if (typeof fn === 'function') {
            const bound = fn.bind(result);
            
            result = await bound(...iargs);
        }
    }

    return result;
}

/// -------------------------------- ///

class Meta {

    /// -------------------------------- ///

    raw: any;
    object: any;

    /// -------------------------------- ///

    constructor(object: any) {
        try {
            this.raw = object;

            if (object === undefined) object = new Undefined();
            if (object === null) object = new Null();

            this.object = object;

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get type() {
        try { return getConstructor(this.object); }
        catch(err) { throw err; }
    }

    get name() {
        try { return getConstructor(this.object).name; }
        catch(err) { throw err; }
    }

    get parent() {
        try { return getConstructorParent(this.object); }
        catch(err) { throw err; }
    }

    get family() {
        try { return familyOf(this.object); }
        catch(err) { throw err; }
    }

    get elder() {
        try { return elderOf(this.object); }
        catch(err) { throw err; }
    }

    get primitive() {
        try { return isPrimitive(this.object); }
        catch(err) { throw err; }
    }

    get nullish() {
        try {
            const { raw } = this;

            return raw == undefined || raw == null;

        } catch(err) { throw err; }
    }

    get falsy() {
        try {
            const { raw } = this;

            return raw == false
                || raw == undefined
                || raw == null;

        } catch(err) { throw err; }
    }

    get truthy() {
        try {
            const { raw } = this;

            return !!raw;

        } catch(err) { throw err; }
    }

    childOf(query: any) {
        try {
            return childOf(this.object, query);

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export {
    Nullish, Undefined, Null,
    AsyncFunction,
    
    Meta,
    isPrimitive, isConstructor, getConstructor, getConstructorParent,
    makerOf, typeOf, childOf, familyOf, elderOf, superInit,
}
