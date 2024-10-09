
// import { typeOf, familyOf } from '../utils/functions/meta.js';

// import { paint, mark } from '../utils/functions/style.js';

// import { CWD, PACKAGE, ENV } from '../NodeProcess/NodeProcess.js';

// const { APP_ERROR_STACK } = ENV as any;

// class ErrorStackCall {

//     error: Error;
//     raw: string;
//     index: number;
//     logLevel?: string;

//     str!: string;

//     pretty: boolean = false;

//     base!: string;
//     call!: string;
//     file!: string;
//     path!: string;

//     node: string | null = null;
//     module: string | null = null;
//     anonymous: boolean = false;

//     category!: string;

//     position: { line: string, column: string } = { line: '', column: '' };

//     constructor(error: Error, raw: string, index: number, logLevel?: string) {
//         try {
//             this.error = error;
//             this.raw = raw;
//             this.index = index;

//             this.logLevel = logLevel ?? APP_ERROR_STACK;

//             this.parse();

//         } catch(err) { throw err; }
//     }
    
//     get shadow() {
//         try {
//             let { category: cat, logLevel } = this;

//             if (logLevel === 'full') return false;
            
//             if (logLevel === 'partial') {
//                 return cat === 'internal' ? true : false;
//             }
            
//             if (logLevel === 'src') {
//                 return cat === 'src' ? false : true;
//             }

//             return false;

//         } catch(err) { throw err; }
//     }

//     parse() {
//         try {
//             this.parseRaw();

//             this.parsePath();

//             this.parsePosition();

//         } catch(err) { throw err; }
//     }

//     prettify() {
//         try {
//             const { shadow, pretty, category } = this;
//             if (shadow || pretty) return pretty ?? undefined;

//             const styles = category === 'src'
//                 ? [ 'cyan', 'yellow' ]
//                 : [ 'gray', 'gray' ];

//             const { anonymous, call, path, file, position: { line, column } } = this;

//             this.call = paint(call, styles[0]);
//             this.file = paint(file, styles[0]);

//             // if (anonymous && path === file) {

//             // }

//             this.path = paint(path, 'gray');

//             this.position.line = paint(line, styles[1]);
//             this.position.column = paint(column, 'gray');

//             return this.pretty = true;

//         } catch(err) { throw err; }
//     }

//     stringify() {
//         try {
//             this.prettify();

//             let { anonymous, call, path, file, position: { line, column } } = this;

//             const [ slash, arrow ] = [ mark('slash'), mark('arrow') ];

//             // if (anonymous) {
//             //     const name = paint('anonymous', 'cyan');

//             //     return `${arrow} ${call} ${surround(name, 'tags', 'gray')}`;
//             // }

//             if (anonymous) {
//                 file = file.replaceAll('<', '').replaceAll('>', '');

//                 path = surround(file, 'tags', 'gray');
//             } else path = `${path}${slash}${file}`;

//             const colons = paint(':', 'gray');

//             const pos = anonymous ? '' : `${colons}${line}${colons}${column}`;

//             return `${arrow} ${call} ${path}${pos}`;

//         } catch(err) { throw err; }
//     }

//     [Symbol.toPrimitive](hint: string) {
//         try {
//             if (hint === 'string') this.stringify();

//             return this.str;

//         } catch(err) { throw err; }
//     }

//     private parseRaw() {
//         try {
//             this.str = this.raw.replace('at', '')
//                 .replaceAll('\\', '/')
//                 .replace('file:///', '')
//                 .trim();

//             let split = this.str.split(' ');
//             let base = split.pop() as string;

//             let call = split.join(' ');
//             call = call.trim();

//             call = call.length > 0 ? call : '[?]';

//             this.call = call;

//             base = base.replaceAll('(', '').replaceAll(')', '');
//             this.base = base;

//             if (base.indexOf('node') === 0) {
//                 this.category = 'node';

//                 split = base.split(':');

//                 this.node = split[1] as string;
//                 this.path = base.replace(`node:`, '');
//             }

//         } catch(err) { throw err; }
//     }

//     private parsePath() {
//         try {
//             let { path, base, category } = this;
//             path = path ?? base;

//             if (category === 'node') {
//                 const split = path.split('/');

//                 if (split.length === 1) {
//                     this.path = path;
//                     this.file = path;
//                 } else {
//                     this.file = split.pop() as string;

//                     this.path = split.join('/');
//                 }

//                 return this.path;
//             }

//             path = path.replaceAll(CWD.valueOf(), '.');

//             const split = path.split('/');
//             this.file = split.pop() as string;

//             const index = split.indexOf('node_modules');

//             if (index === 0) {
//                 this.category = 'module';

//                 const module = this.getModule(split[1]) ?? '?';

//                 this.module = module;
//                 this.path = `./node_modules/${module}/.../${split.pop()}`;
//             } else {
//                 this.category = 'src';

//                 if (path.includes('anonymous')) this.anonymous = true;

//                 this.path = path;
//             }

//             return this.path;

//         } catch(err) { throw err; }
//     }

//     private parsePosition() {
//         try {
//             const { base, file } = this;
//             const match = base.match(/:(\d+):(\d+)/) as string[];

//             if (!match) return;

//             const line = match?.[1] ?? '';
//             const column = match?.[2] ?? '';

//             this.position = { line, column };

//             this.path = this.path.replace(`/${this.file}`, '');
//             this.file = file.replace(`:${line}:${column}`, '');

//         } catch(err) { throw err; }
//     }

//     private getModule(name: string) {
//         try {
//             const { dependencies } = PACKAGE();

//             for (const mod in dependencies) {
//                 if (name.indexOf(mod) > -1) return mod;
//             }

//             return null;

//         } catch(err) { throw err; }
//     }
// }

// class ErrorStackLines {

//     error!: Error;
//     logLevel?: string;

//     lines: ErrorStackCall[] = [];

//     source: ErrorStackCall | null = null;

//     pretty: boolean = false;

//     constructor(error: Error, logLevel?: string) {
//         try {
//             this.error = error;
//             this.logLevel = logLevel;

//             this.parse();

//         } catch(err) { throw err; }
//     }

//     get raw() {
//         try { 
//             const { name, message, stack } = this.error;
//             if (!stack) return message;

//             return stack
//                 .replaceAll(`${name}:`, '')
//                 .replaceAll(message, '')
//                 .trim();

//         } catch(err) { throw err; }
//     }

//     parse() {
//         try {
//             const { raw, error, lines, logLevel } = this;
//             if (raw === error.message) return;

//             const split = raw.split('\n');
//             let i = 0;

//             for (const str of split) {
//                 const line = new ErrorStackCall(error, str, i, logLevel);

//                 if (line.category === 'src' && !this.source) {
//                     this.source = line;
//                 }

//                 lines.push(line);
//                 i++;
//             }

//         } catch(err) { throw err; }
//     }

//     prettify() {
//         try {
//             const { pretty, lines, source } = this;
//             if (pretty) return true;

//             for (const line of lines) {
//                 const { shadow, call, file, position: pos } = line;

//                 if (!shadow) {
//                     // if (line === source && logLevel !== 'src') {
//                     if (line === source) {
//                         line.call = paint(call, 'red');
//                         line.file = paint(file, 'red');
//                         line.position.line = paint(pos.line, 'red');
//                     }

//                     line.prettify();
//                 }
//             }

//             return this.pretty = true;

//         } catch(err) { throw err; }
//     }

//     stringify() {
//         try {
//             this.prettify();

//             let stack = ``;

//             for (const line of this.lines) {
//                 if (!line.shadow) {
//                     if (stack.length === 0) stack += ' ';
//                     else stack += '  ';

//                     stack += `${line.stringify()}\n`;
//                 }
//             }

//             return stack;

//         } catch(err) { throw err; }
//     }

//     [Symbol.toPrimitive](hint: string) {
//         try {
//             if (hint === 'string') return this.stringify();

//         } catch(err) { throw err; }
//     }
// }

// export class ErrorStack {
    
//     error: Error;
//     lines: ErrorStackLines;
//     formatter: (msg: string, stack?: ErrorStack) => string;

//     pretty: boolean = false;
//     _title!: string;
//     _message!: string;

//     constructor(error: Error, logLevel?: string) {
//         try {
//             this.error = error;
//             this.lines = new ErrorStackLines(error, logLevel);
//             this.formatter = (error as any).formatter ?? ((msg: string) => msg);

//         } catch(err) { throw err; }
//     }

//     get name() {
//         try {
//             return Object.getPrototypeOf(this.error).name;

//         } catch(err) { throw err; }
//     }

//     get elder() {
//         try {
//             const type = typeOf(this.error);
//             const family = familyOf(this.error);
            
//             const skip = [ 'Object', 'Error', 'ProcessError' ];

//             for (const member of family.reverse()) {
//                 const { name } = member;

//                 if (skip.indexOf(name) > -1) continue;
//                 if (member === type) continue;

//                 return member;
//             }

//         } catch(err) { throw err; }
//     }

//     get title() {
//         try {
//             const { _title, name, elder } = this;
//             if (_title) return _title;

//             let title = `${name}`;
//             if (elder) title += ` from ${elder.name}`;

//             return this._title = title;

//         } catch(err) { throw err; }
//     }

//     get message() {
//         try {
//             const { _message, error } = this;
//             if (_message) return _message;

//             return this._message = this.formatter(error.message, this);

//         } catch(err) { throw err; }
//     }

//     prettify() {
//         try {
//             if (this.pretty) return true;

//             let { name, message, lines, elder } = this;

//             let title = paint(name, 'red');

//             if (elder) {
//                 const elderName = paint(elder.name, 'red');

//                 title += ` ${paint(`from`, 'gray')} ${elderName}`;
//             }

//             this._title = title;

//             message = paint(message, 'yellow');
//             this._message = message;
            
//             lines.prettify();

//             return this.pretty = true;

//         } catch(err) { throw err; }
//     }

//     stringify() {
//         try {
//             this.prettify();

//             let { title, message, lines } = this;

//             title = surround(title, 'tags', 'gray');
//             // message = surround(message, 'tags', 'gray');

//             return `${title}\n${message}\n${lines}`;

//         } catch(err) { throw err; }
//     }

//     log() {
//         try {
//             const formatted = this.stringify();
//             console.error(formatted);

//             return this.error;

//         } catch(err) { throw err; }
//     }

//     [Symbol.toPrimitive](hint: string) {
//         try {
//             if (hint === 'string') return this.stringify();

//         } catch(err) { throw err; }
//     }
// }
