
// import { Request, Response, NextFunction } from 'express';

// import { type Server } from '../Server.js';
// import { ServerError } from '../ServerError.js';

// class MiddlewareManagerError extends ServerError {

//     manager: MiddlewareManager;
    
//     constructor(manager: MiddlewareManager, message: string) {
//         super(message);

//         this.manager = manager;
//     }
// }

// class DuplicateMiddlewareError extends MiddlewareManagerError {

//     constructor(manager: MiddlewareManager, name: string) {
//         super(manager, `Attempt to duplicate middleware "${name}"`);
//     }
// }

// type MiddlewareCallback = (req: Request, res: Response, next: NextFunction) => any;

// type MiddlewareOptions = {
//     name: string;
//     callback: MiddlewareCallback;

//     enabled?: boolean;
//     priority?: number;
// }

// class MiddlewareManager {

//     server: typeof Server;
//     protected middlewares: Middleware[];

//     constructor(server: typeof Server, ...mdlws: MiddlewareOptions[]) {
//         try {
//             this.server = server;
//             this.middlewares = [];

//             for (const opts of mdlws) this.create(opts, true);

//         } catch(err) { throw err; }
//     }

//     create(options: MiddlewareOptions, add: boolean = true) {
//         try {
//             const mdlw = new Middleware(this, options);

//             return add ? this.add(mdlw) : mdlw;

//         } catch(err) { throw err; }
//     }

//     add(mdlw: Middleware) {
//         try {
//             const { name } = mdlw;

//             const found = this.find(name);
//             if (found) throw new DuplicateMiddlewareError(this, name);

//             this.middlewares.push(mdlw);

//             return mdlw;

//         } catch(err) { throw err; }
//     }

//     find(finder: string | ((m: Middleware) => boolean)) {
//         try {
//             const { middlewares } = this;

//             if (typeof finder === 'string') {
//                 const name = finder;

//                 finder = (m: Middleware) => m.name === name; 
//             }

//             return middlewares.find(finder);

//         } catch(err) { throw err; }
//     }

//     fetch(...names: string[] | [ ((m: Middleware) => boolean) ]) {
//         try {
//             const { middlewares } = this;

//             if (names.length === 1 && typeof names[0] === 'function') {
//                 return middlewares.filter(names[0]); 
//             }

//             const filter = (m: Middleware) => {
//                 return (names as string[]).indexOf(m.name) !== -1;
//             }

//             return middlewares.filter(filter);

//         } catch(err) { throw err; }
//     }

//     sort() {
//         try {
//             const { middlewares } = this;
    
//             return middlewares.sort((a, b) => a.priority - b.priority);

//         } catch(err) { throw err; }
//     }

//     use() {
//         try {
//             const { server } = this;
//             const middlewares = this.sort().filter(m => m.enabled);
                        
//             for (const mdlw of middlewares) {
//                 server.app.use(mdlw.callback);
//             }
            
//         } catch(err) { throw err; }
//     }
// }

// class MiddlewareError extends ServerError {

//     middleware: Middleware;
    
//     constructor(mdlw: Middleware, message: string) {
//         super(message);

//         this.middleware = mdlw;
//     }
// }

// class Middleware {

//     manager: MiddlewareManager;

//     name: string;
//     callback: MiddlewareCallback;
    
//     priority: number;
//     enabled: boolean;

//     constructor(manager: MiddlewareManager, options: MiddlewareOptions) {
//         try {
//             this.manager = manager;

//             this.name = options.name;
//             this.callback = options.callback;

//             this.priority = options.priority ?? -1;
//             this.enabled = options.enabled ?? true;

//         } catch(err) { throw err; }
//     }

    // use(server: Server) {
    //     try {
    //         const { enabled, callback } = this;
    //         if (!enabled) return;
                
    //         server.app.use(callback);

    //         return this;

    //     } catch(err) { throw err; }
    // }
// }

// export {
//     MiddlewareManager, MiddlewareManagerError,
//     Middleware, MiddlewareError,

//     type MiddlewareOptions, type MiddlewareCallback,
//     type Request, type Response, type NextFunction
// }
