
import { resolve, join, parse } from 'path';

import { childOf } from '../functions/meta.js';

import { paint, mark } from '../functions/style.js';

type PathLike = Path | string;

class PathError extends Error {

    constructor(message: string, path: PathLike) {
        path = paint(`"${path.valueOf()}"`, 'green');

        super(`${message}\nReceived: ${path}`);

        this.name = this.constructor.name;
    }
}

class InvalidPathError extends PathError {

    constructor(path: PathLike) {
        super(`Invalid path-like entry.`, path);
    }
}

class Path extends String {

    static isPath(path: PathLike) {
        try {
            if (path instanceof Path) return path.separator;

            let seps = { ['/']: 0, ['\\']: 0 };

            for (const sep in seps) {
                const filter = (char: string) => char === sep;
                const count = path.split('').filter(filter).length;

                (seps as any)[sep] = count;
            }

            if (seps['/'] === 0 && seps['\\'] === 0) return false;

            if (seps['/'] > seps['\\']) return '/';
            if (seps['\\'] > seps['/']) return '\\';

        } catch(error) { throw error; }
    }

    static from(object: NonNullable<any>, ...paths: PathLike[]) {
        try {
            let path: any = object;

            if (childOf(object, 'SystemData')) path = object.path.valueOf();
            if (childOf(object, String)) path = object.valueOf();

            path = new Path(path);

            return path.join(...paths);

        } catch(error) { throw error; }
    }

    static getReal(path: PathLike) {
        try {
            if (!Path.isPath(path)) throw new InvalidPathError(path);
            
            return path.replaceAll('file:///', '').replaceAll('\\', '/');
    
        } catch(error) { throw error; }
    }

    static match(path: PathLike, match: PathLike) {
        try {
            if (!Path.isPath(path)) throw new InvalidPathError(path);

            const split = match.valueOf().split('?');

            for (let i = 0; i < split.length; i++) {
                if (path.indexOf(split[i]) === -1) return false;
            }

            return true;

        } catch(error) { throw error; }
    }

    separator!: string;

    _value!: string;

    _dir: string = '';
    _base: string = '';
    _ext: string = '';
    _name: string = '';
    _root: string = '';

    constructor(path: PathLike, separator?: `/` | `\\`) {
        try {
            if (path instanceof Path) path = path.valueOf();

            super(path);

            this.update(path, separator);

        } catch(error) { throw error; }
    }
    
    valueOf() {
        try {
            return this._value;

        } catch(error) { throw error; }
    }

    update(path: PathLike, separator?: `/` | `\\`) {
        try {
            const sep = Path.isPath(path);
            if (!sep) throw new InvalidPathError(path);

            separator ??= (sep as `/` | `\\`);

            this._value = path.replaceAll('\\', separator)
                .replaceAll('/', separator);

            this.separator = separator;
            
            this._dir = '';
            this._base = '';
            this._ext = '';
            this._name = '';
            this._root = '';

            return this;

        } catch(error) { throw error; }
    }

    parse() {
        try {
            const path = this.valueOf();
            const { dir, base, ext, name, root } = parse(path);

            this._dir = dir;
            this._base = base;
            this._ext = ext;
            this._name = name;
            this._root = root;

            return this;

        } catch(error) { throw error; }
    }

    get dir() {
        try {
            if (this._dir.length === 0) this.parse();

            return this._dir;

        } catch(error) { throw error; }
    }

    get base() {
        try {
            if (this._base.length === 0) this.parse();

            return this._base;

        } catch(error) { throw error; }
    }

    get ext() {
        try {
            if (this._ext.length === 0) this.parse();

            return this._ext;

        } catch(error) { throw error; }
    }

    get name() {
        try {
            if (this._name.length === 0) this.parse();

            return this._name;

        } catch(error) { throw error; }
    }

    get root() {
        try {
            if (this._root.length === 0) this.parse();

            return this._root;

        } catch(error) { throw error; }
    }

    get parent() {
        try {
            const split = this.split();
            split.pop();

            return split.pop();

        } catch(error) { throw error; }
    }

    get real() {
        try {
            return Path.getReal(this.valueOf());

        } catch(error) { throw error; }
    }

    get depth() {
        try {
            return this.split().length;

        } catch(error) { throw error; }
    }

    split() {
        try {
            const { _value, separator } = this;

            return _value.split(separator);

        } catch(error) { throw error; }
    }

    join(...paths: PathLike[]) {
        try {
            if (paths.length === 0) return this;

            const { _value, separator } = this;

            let path = _value;

            for (let i = 0; i < paths.length; i++) {
                let next = paths[i];

                const sep = Path.isPath(next);
                if (sep) next = next.replaceAll(sep, separator);

                path = `${path}${separator}${next}`;
            }
            
            return this.update(path);

        } catch(error) { throw error; }
    }

    up(count = 1) {
        try {
            let path = this.valueOf();

            for (let i = 0; i < count; i++) {
                path = resolve(path, '..');
            }

            path = path.replaceAll('\\', this.separator)
                .replaceAll('/', this.separator);

            return new Path(path);

        } catch(error) { throw error; }
    }

    childOf(path: string | Path) {
        try {
            path = new Path(path);

            return Path.match(this, path);

        } catch(error) { throw error; }
    }

    [Symbol.toPrimitive](hint: string) {
        try {
            return this.valueOf();

        } catch(error) { throw error; }
    }

    [Symbol.toStringTag]() {
        try {
            return this.valueOf();

        } catch(error) { throw error; }
    }
}

const isPath = Path.isPath;
const getRealPath = Path.getReal;

export {
    Path, PathError, InvalidPathError,
    isPath, getRealPath,

    type PathLike
}
