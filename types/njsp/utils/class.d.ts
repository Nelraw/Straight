
declare namespace Global.Class {
    type Constructor<T = null> = T extends null
        ? { name: string; prototype: { [key: string]: any }; length: number }
        : new (...args: ConstructorParameters<typeof T>) => T;

    type ParentOf<P, T> = T extends P ? P : never;
    type ChildOf<C, T> = C extends T ? C : never;

    type Name<T> = Constructor<T>['name'];
}
