
/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';
import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';

/// -------------------------------- ///

// type Dict = Global.Dict;
type Matcher<T> = Global.Iterables.Array.Matcher<T>;

/// -------------------------------- ///

class ListError<K extends string, O extends object> extends ProcessError {

    list?: List<K, O>;

    constructor(data: ProcessErrorData, list?: List<K, O>) {
        try {
            super(data);

            this.list = list;
            this.source = { object: list };

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

// type ListEntry<K extends string, O extends object> = Parameters<(key: K, object: O) => void>;
type ListEntry<K extends string, O extends object> = [ K, O ];
type ListEntries<K extends string, O extends object> = Array<ListEntry<K, O>>;

class List<K extends string, O extends object> extends ProcessObject {

    protected list: Map<K, O>;

    // constructor(...items: Array<[ K, O ]>) {
    // constructor(...items: Array<ListEntry<K, O>>) {
    constructor(...items: ListEntries<K, O>) {
        try {
            super();

            this.list = new Map<K, O>(items);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    protected get array() { return Array.from(this.list); }

    get length() { return this.list.size; }

    get type() {
        try {
            const { list, array } = this;
            if (list.size > 0) return makerOf(array[0]);

        } catch(err) { throw err; }
    }

    get object() {
        try {
            const { entries } = this;
            const result: Global.Dict<O> = {};

            for (const [ key, value ] of entries) {
                result[key] = value;
            }

            return result;

        } catch(err) { throw err; }
    }

    get keys() { return Array.from(this.list.keys()); }
    get values() { return Array.from(this.list.values()); }
    get entries() { return Array.from(this.list.entries()); }

    keyOf(value: O) {
        try {
            for (const [ k, v ] of this.list) {
                if (v === value) return k;
            }

        } catch(err) { throw err; }
    }

    has(key: K) { return this.list.has(key); }

    get(key: K) {
        try {
            const { list } = this;

            if (list.has(key)) return list.get(key);

        } catch(err) { throw err; }
    }

    set(key: K, value: O): [ K, O ] {
        try {
            if (this.list.has(key)) {
                const message = `Key "${key}" already exists`;

                throw new ListError({ message }, this);
            }

            this.list.set(key, value);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    add(...items: Array<[ K, O ]>) {
        try {
            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of items) {
                const set = this.set(key, value);

                results.push(set);
            }

        } catch(err) { throw err; }
    }

    delete(key: K | O) {
        try {
            const { list } = this;

            if (typeof key !== 'string') key = this.keyOf(key) as K;

            if (list.has(key)) return list.delete(key);

        } catch(err) { throw err; }
    }

    clear() { return this.list.clear(); }

    at(index: number) {
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] =  array[index] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    get first(): [ K, O ] | undefined {
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] = array[0] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    get last(){
        try {
            const { list, array } = this;
            if (list.size === 0) return;

            const [ key, value ] = array[list.size - 1] ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    shift() {
        try {
            const { list, array } = this;
            if (list.size === 0) return;
            
            const [ key, value ] = array[0] ?? [];

            this.delete(key);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    pop() {
        try {
            const { size } = this.list;
            if (size === 0) return;

            const [ key, value ] = this.array[size - 1] ?? [];

            this.delete(key);

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    find(matcher: Matcher<[ K, O ]>) {
        try {
            const [ key, value ] = this.array.find(matcher) ?? [];

            return [ key, value ];
            // return value;

        } catch(err) { throw err; }
    }

    filter(matcher: Matcher<[ K, O ]>) {
        try {
            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of this.list) {
                if (matcher([ key, value ])) {
                    results.push([ key, value ]);
                }
            }

            return results;
            // return this.array.filter(matcher);

        } catch(err) { throw err; }
    }

    [Symbol.iterator]() {
        try {
            return this.list[Symbol.iterator]();

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export { List, ListError, type ListEntry, type ListEntries }
