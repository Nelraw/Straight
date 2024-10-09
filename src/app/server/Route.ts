
// import { Request, Response } from 'express';
// import { Server, ServerError } from './Server.js';

// export type RouteCallback = (req: Request, res: Response) => any;

// export type RouteOptions = {
//     path: string;
//     callback: RouteCallback;

//     enabled?: boolean;
// }

// export class Route {

//     static get routes() {
//         try {
//             const { routes } = Server;

//             return routes.filter(route => route.enabled);

//         } catch(err) { throw err; }
//     }

//     static use(server: Server) {
//         try {
//             const { routes } = this;
                        
//             for (const route of routes) {
//                 server.app.post(route.path, route.callback);
//             }
            
//         } catch(err) { throw err; }
//     }
    
//     path: string;
//     callback: RouteCallback;

//     enabled: boolean;

//     constructor(options: RouteOptions) {
//         try {
//             this.path = options.path;
//             this.callback = options.callback;

//             this.enabled = options.enabled ?? true;


//         } catch(err) { throw err; }
//     }
// }

// export { Request, Response };
