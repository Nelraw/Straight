
/// -------------------------------- ///

import { makerOf, childOf } from '../../functions/meta.js';
import { ProcessObject, ProcessError, ProcessErrorData, ErrorData } from '../../../njsp/Process.js';

/// -------------------------------- ///

// type Dict = Global.Dict;
import $Array = Global.Iterables.Array;

type Matcher<T> = $Array.Matcher<T>;
type AsyncMatcher<T> = $Array.AsyncMatcher<T>;

type Finder<T> = $Array.Finder<T>;
type AsyncFinder<T> = $Array.AsyncFinder<T>;

type Mapper<T, R = any> = $Array.Mapper<T, R>;
type AsyncMapper<T, R = any> = $Array.AsyncMapper<T, R>;

/// -------------------------------- ///

class ListError<K extends string | number, O> extends ProcessError {

    // list?: List<K, O>;

    constructor(data: ProcessErrorData, list?: List<K, O>) {
        try {
            super(data);

            Object.defineProperty(this, `list`, { value: list });
            // this.source = { object: list };

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///
}

class UnexistingListItemError<K extends string | number, O> extends ListError<K, O> {

    constructor(index: K, prop: string, list?: List<K, O>) {
        try {
            const message = `Attempt to perform "${prop}" method`;

            super(`${message} on unexisting item (index: ${index})`, list);

        } catch(err) { throw err; }
    }
}

class EmptyListError<K extends string | number, O> extends ListError<K, O> {

    constructor(prop: string, list?: List<K, O>) {
        try {
            const message = `Attempt to access "${prop}" property`;

            super(`${message} on empty list`, list);

        } catch(err) { throw err; }
    }
}

class ListLengthError<K extends string | number, O> extends ListError<K, O> {

    constructor(i: number, len: number, list?: List<K, O>) {
        try {
            const message = `Attempt to get item at "${i}"`;

            super(`${message} on list of ${len} length`, list);

        } catch(err) { throw err; }
    }
}

class DuplicateListItemError<K extends string | number, O> extends ListError<K, O> {

    constructor(index: K, list?: List<K, O>) {
        try {
            const message = `Attempt to duplicate item (index: "${index}")`;

            super(message, list);

        } catch(err) { throw err; }
    }
}

type ListEntry<K extends string | number, O> = [ K, O ];
type ListEntries<K extends string | number, O> = Array<ListEntry<K, O>>;

class List<K extends string | number, O> extends ProcessObject {

    protected list: Map<K, O>;

    constructor(...items: ListEntries<K, O>) {
        try {
            super();

            this.list = new Map<K, O>(items);

        } catch(err) { throw err; }
    }

    /// -------------------------------- ///

    get length() { return this.list.size; }

    get types() {
        try {
            const { list: { size }, values } = this;

            if (size == 0) throw new EmptyListError(`types`, this);

            const types: { [key: string]: any } = {};

            for (const value of values) {
                const type = makerOf(value);
                const { name } = type;

                if (!types[name]) types[name] = type;
            }

            return types;

        } catch(err) { throw err; }
    }

    get object(): Record<K, O> {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`object`, this);

            const result: any = {};

            for (const [ key, value ] of entries) {
                result[key] = value;
            }

            return result;

        } catch(err) { throw err; }
    }

    get keys() { return Array.from(this.list.keys()); }
    get values() { return Array.from(this.list.values()); }
    get entries() { return Array.from(this.list.entries()); }

    keyOf(query: O): K | undefined {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`keyOf`, this);

            for (const [ key, value ] of entries) {
                if (value === query) return key;
            }

        } catch(err) { throw err; }
    }

    has(key: K): boolean {
        try {
            const { list } = this;

            if (list.size == 0) throw new EmptyListError(`has`, this);
            
            return list.has(key);

        } catch(err) { throw err; }
    }

    get(key: K): O | undefined {
        try {
            const { list } = this;

            if (list.size == 0) throw new EmptyListError(`get`, this);

            if (list.has(key)) return list.get(key);

        } catch(err) { throw err; }
    }

    set(key: K, value: O): [ K, O ] {
        try {
            const { list } = this;

            if (list.has(key)) {
                throw new DuplicateListItemError(key, this);
            }

            list.set(key, value);

            return [ key, value ];

        } catch(err) { throw err; }
    }

    add(...items: Array<[ K, O ]>): Array<[ K, O ]> {
        try {
            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of items) {
                const set = this.set(key, value);

                results.push(set);
            }

            return results;

        } catch(err) { throw err; }
    }

    delete(key: K | O): [ K, O ] | undefined {
        try {
            const { list } = this;

            if (list.size == 0) throw new EmptyListError(`delete`, this);

            const type = typeof key;
            
            if (type !== `string` && type !== `number`) {
                key = this.keyOf(key as O) as K;
            }

            if (!list.has(key as K)) {
                throw new UnexistingListItemError(key as K, `delete`, this);
            }

            const value = list.get(key as K);

            list.delete(key as K);

            return [ key as K, value as O ];

        } catch(err) { throw err; }
    }

    clear() {
        try {
            const { list } = this;

            if (list.size == 0) {
                throw new EmptyListError(`clear`, this);
            }

            return list.clear();

        } catch(err) { throw err; }
    }

    at(index: number): [ K, O ] | undefined {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`at`, this);

            if (index > size - 1) {
                throw new ListLengthError(index, size, this);
            }

            const [ key, value ] =  entries[index];

            return [ key, value ];

        } catch(err) { throw err; }
    }

    get first(): [ K, O ] | undefined {
        try {
            const { list, entries } = this;

            if (list.size == 0) {
                throw new EmptyListError(`first`, this);
            }

            const [ key, value ] = entries[0];

            return [ key, value ];

        } catch(err) { throw err; }
    }

    get last(): [ K, O ] | undefined {
        try {
            const { list, entries } = this;

            if (list.size == 0) {
                throw new EmptyListError(`first`, this);
            }

            const [ key, value ] = entries[list.size - 1];

            return [ key, value ];

        } catch(err) { throw err; }
    }

    shift(): [ K, O ] | undefined {
        try {
            const { list, entries } = this;
            
            if (list.size == 0) throw new EmptyListError(`shift`, this);
            
            const [ key, value ] = entries[0];

            this.delete(key);

            return [ key, value ];

        } catch(err) { throw err; }
    }

    pop(): [ K, O ] | undefined {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`pop`, this);

            const [ key, value ] = entries[size - 1] ?? [];

            this.delete(key);

            return [ key, value ];

        } catch(err) { throw err; }
    }

    find(finder: Finder<O>): [ K, O ] | undefined {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`find`, this);

            for (const [ key, value ] of entries) {
                const found = finder(value);

                if (found) return [ key, value ];
            }

        } catch(err) { throw err; }
    }

    filter(matcher: Matcher<O>) {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`filter`, this);

            const results: Array<[ K, O ]> = [];

            for (const [ key, value ] of entries) {
                if (matcher(value)) {
                    results.push([ key, value ]);
                }
            }

            return results;

        } catch(err) { throw err; }
    }

    private fetchingPromises(finder: AsyncMatcher<O> | AsyncFinder<O>): Array<Promise<[ K, O | undefined ]>> {
        try {
            const { list: { size }, entries } = this;

            if (size == 0) throw new EmptyListError(`fetch`, this);

            type Result = [ K, O | undefined ];

            const promises: Array<Promise<Result>> = [];

            for (const [ key, value ] of entries) {
                const promise = new Promise<Result>(async (resolve) => {
                    const result = await (finder as AsyncFinder<O>)(value);

                    resolve([ key, result ]);
                });

                promises.push(promise);
            }
            
            return promises;

        } catch(err) { throw err; }
    }

    async search(finder: AsyncMatcher<O> | AsyncFinder<O>): Promise<[ K, O | undefined ]> {
        try {
            const promises = this.fetchingPromises(finder);

            return Promise.race(promises);

        } catch(err) { throw err; }
    }

    async fetch(finder: AsyncMatcher<O> | AsyncFinder<O>): Promise<Array<[ K, O | undefined ]>> {
        try {
            const promises = this.fetchingPromises(finder);

            return Promise.all(promises);

        } catch(err) { throw err; }
    }

    [Symbol.iterator]() {
        try {
            const { list } = this;

            return list[Symbol.iterator]();

        } catch(err) { throw err; }
    }
}

/// -------------------------------- ///

export { List, ListError, type ListEntry, type ListEntries }
