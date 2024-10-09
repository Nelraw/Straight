
// import express, { Request, Response, NextFunction } from 'express';
// import morgan from 'morgan';


// import { Application, ApplicationOptions } from 'tslib';
// import { ServerError } from './ServerError.js';

// import { MiddlewareManager } from './managers/MiddlewareManager.js';
// import { Route, type RouteOptions } from './Route.js';

// import { ProcessError } from '../../lib/error/ProcessError.js';

// export class ServerError extends ProcessError {

//     constructor(message: string) {
//         try {
//             super(message);

//         } catch(error) { throw error; }
//     }
// }

// const middlewares = [
//     {
//         name: 'morgan',
//         priority: -10*10,
//         callback: morgan('dev')
//     }
// ];

// export class Server extends Application {

//     static routes: Route[] = [];
//     static middlewares = new MiddlewareManager(this, ...middlewares);

//     port: number;

//     constructor() {
//         super();

//         this.app = express();
//         this.port = this.ENV.SERVER_PORT as number;
//     }

//     get middlewares() {
//         try {
//             return Object.getPrototypeOf(this).middlewares;

//         } catch(err) { throw err; }
//     }

//     get routes() {
//         try {
//             return Object.getPrototypeOf(this).routes;

//         } catch(err) { throw err; }
//     }

//     createRoute(options: RouteOptions, add: boolean = true) {
//         try {
//             const route = new Route(options);
//             if (add) this.routes.push(route);

//             return route;

//         } catch(err) { throw err; }
//     }

//     fetchRoute(finder: string | ((m: Route) => boolean)) {
//         try {
//             const { routes } = this;

//             if (typeof finder === 'string') {
//                 const path = finder;

//                 finder = (m: Route) => m.path === path; 
//             }

//             return routes.find(finder);

//         } catch(err) { throw err; }
//     }

//     async start() {
//         const { app, port } = this;

//         return super.start().then(() => {
//             // Middleware.use(this);
//             // Route.use(this);

//             const msg = `Server is listening ${port} port.`;
//             const callback = () => console.log(msg);

//             app.listen(port, callback);
//         });
//     }
// }


