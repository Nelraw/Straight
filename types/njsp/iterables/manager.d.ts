
namespace Global.Iterables.Manager {

    // type ManagerModels<M extends Manager> = { [key: string]: M['models'][K] };

    // type ManagerModelsKwargs<M extends Manager> = ManagerModels<M> extends infer Models
    //     ? { [K in keyof Models]: ConstructorParameters<Constructor<Models[K]>>[1] }
    //     : never;

    // type ManagerModelKwargs<M extends Manager, N extends keyof ManagerModels<M>> = ManagerModelsKwargs<M>[N];


    type ManagerModels<M extends Manager> = { [K in keyof M['models']['object']]: M['models']['object'][K] };
    type ManagerModelNames<M extends Manager> = M['models']['keys'];

    type ManagerModelsKwargs<M extends Manager> = ManagerModels<M> extends infer Models
        ? { [K in keyof Models]: ConstructorParameters<Constructor<Models[K]>>[1] }
        : never;

    type ManagerModelKwargs<M extends Manager, N extends keyof ManagerModels<M>> = ManagerModelsKwargs<M>[N];

}
