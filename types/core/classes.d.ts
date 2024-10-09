
declare namespace Classes {
    type Constructor<T> = new (...args: ConstructorParameters<typeof T>) => T;
    type ParentOf<P, T> = T extends P ? P : never;
    type ChildOf<C, T> = C extends T ? C : never;
}
