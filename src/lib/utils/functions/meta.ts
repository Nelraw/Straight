
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
    if (object == undefined) return Undefined;
    if (object == null) return Null;

    if (isConstructor(object)) return object;

    return Object.getPrototypeOf(object).constructor;
}

function getConstructorParent(object: any) {
    if (object == undefined) return Undefined;
    if (object == null) return Null;

    const type = getConstructor(object);

    return Object.getPrototypeOf(type);
}

function isPrimitive(object: any, strict: boolean = false) {
    try {
        const type = getConstructor(object);
        const family = familyOf(type);

        if (family.length === 1) return Object;
        
        const checker = (type: any) => {
            const finder = (cstr: any) => cstr === type;
            const prim = [ String, Number, Boolean, Array, Function ];

            return prim.find(finder) ? true : false;
        }

        if (strict) return checker(type) ? type : undefined;

        return family.find(checker);

    } catch(error) { throw error; }
}

function familyOf(object: any) {
    const type = getConstructor(object);
    const family = [ type ];

    if (type === Object) return family;

    let parent = getConstructorParent(type);

    while (true) {
        const skip = parent == Object || parent?.name == '';
        if (parent == null || skip) break;

        family.push(parent);

        parent = Object.getPrototypeOf(parent);
    }

    family.push(Object);

    return family;
}

function elderOf(object: any) {
    const family = familyOf(object);

    return family[family.length - 2];
}

function childOf(object: any, query: any) {
    const family = familyOf(object);

    const finder = typeof query == 'string'
        ? (type: any) => type?.name === query
        : (type: any) => type === query;

    return family.find(finder);
}

function typeOf(object: any, query?: any) {
    const type = getConstructor(object);

    if (query === undefined) return type;

    if (typeof query === 'string') {
        return type?.name === query ? type : undefined;
    }

    return type === getConstructor(query) ? type : undefined;
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

export {
    Nullish, Undefined, Null,
    
    isPrimitive, isConstructor, getConstructor, getConstructorParent,
    makerOf, typeOf, childOf, familyOf, elderOf, superInit,
}
