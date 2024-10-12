
declare namespace Global {

    type Dict<VT = any, S extends number | undefined = undefined> = { [key: string]: VT } extends infer O
        ? S extends undefined ? O :
            ? Exctract<O, keyof O> extends L
                ? UnionToTuple<L>['length'] extends S ? O : never
                : never
            : never;
    
    type Primitive<R extends boolean = false> = R extends false
        ? boolean | number | string | bigint | null | undefined
        : boolean | number | string | bigint | symbol | null | undefined;

    type Real<O extends Object | object = Object | object> = NonNullable<O>;

    type Like<T, P> = T extends P ? T : never;

    type Merge<T, U> = Omit<T, keyof U> & U;

    type Select<T, K extends keyof T = keyof T> = K extends keyof T ? Pick<T, K> : never;

    type Tuple<L extends number = 1, T extends any = any, A extends number[] = []> = A['length'] extends L
        ? A : Tuple<L, T, [...A, T ]>;

    type UnionToIntersection<U> = 
    (U extends any ? (arg: U) => void : never) extends (arg: infer I) => void
        ? I
        : never;

    type LastOf<T> = UnionToIntersection<T extends any ? (x: T) => void : never> extends (x: infer Last) => void 
        ? Last : never;

    type UnionToTuple<T, L = LastOf<T>> = [L] extends [never]
        ? [] 
        : [...UnionToTuple<Exclude<T, L>>, L];

    type TupleToUnion<T extends any[]> = T extends [ infer F, ...infer R ]
        ? F | (R['length'] extends 0 ? F : TupleToUnion<R>)
        : never;

    type UUID = `${string}-${string}-${string}-${string}-${string}`;
}
