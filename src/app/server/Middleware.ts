
// import { Request, Response, NextFunction } from 'express';
// import { Server } from './Server.js';

// type MiddlewareCallback = (req: Request, res: Response, next: NextFunction) => any;

// type MiddlewareOptions = {
//     readonly name: string;
//     readonly callback: MiddlewareCallback;

//     readonly isGate?: boolean;
//     enabled?: boolean;
//     priority?: number;
// }

// class Middleware {

//     readonly server: Server;
    
//     readonly name: string;
//     readonly callback: MiddlewareCallback;
    
//     readonly isGate: boolean;
//     protected enabled: boolean;
//     priority: number;

//     constructor(server: Server, options: MiddlewareOptions) {
//         try {
//             const { name, priority, enabled, isGate, callback } = options;

//             this.server = server;

//             this.name = name;
//             this.priority = priority ?? -1;
//             this.enabled = enabled ?? true;
//             this.isGate = isGate ?? false;

//             this.callback = callback;

//         } catch(err) { throw err; }
//     }

//     use(server: Server) {
//         try {
//             const { callback, enabled, isGate } = this;

//             const fn = (...args: Parameters<typeof callback>) => {
//                 try {
//                     const [ req, res, next ] = args;
//                     if (!enabled) next();

//                     const result = callback(req, res, next);

//                     if (isGate) {
                        
//                     }

//                     return result;

//                 } catch(err) { throw err; }
//             }
                
//             server.app.use(fn);

//             return this;

//         } catch(err) { throw err; }
//     }

//     enable() { this.toggle(true); }
//     disable() { this.toggle(false); }

//     protected toggle(value: boolean) {
//         try {
//             return this.enabled = value;

//         }  catch(err) { throw err; }
//     }
// }

// export {
//     Middleware,
//     type MiddlewareOptions, type MiddlewareCallback,

//     // From express
//     Request, Response, NextFunction
// };
