
declare namespace Global.Iterables {

    type Iterable<T> = T[Symbol.iterator] extends Symbol.iterator ? T : never;
    type Iterator<T> = T extends Iterable<T> ? T[Symbol.iterator] : never;

    type Values<T extends Iterable<T>> = T extends any[]
        ? Array.Values<T>
        : Map.Values<T>;

    type First<T extends any[]> = T extends [ infer U, ...any[] ] ? U : never;
    type Last<T extends any[]> = T['length'] extends infer L ? T[L] : never;

    type Rest<T extends any[]> = T extends [ infer A, ...infer Rest ] ? Rest : never;

    type Concat<T extends any[], U extends any[]> = [ ...T, ...U ];
}

namespace Global.Iterables.Array {
    type Values<A extends any[]> = A extends (infer T)[] ? T : never;

    type Callback<OT, RT = any> = (object: OT, index?: number, array?: Array<OT>) => RT;
    type Matcher<OT> = (...args: Parameters<Callback<OT>>) => boolean;
    type Mapper<OT, RT = any> = (...args: Parameters<Callback<OT>>) => RT;

    type Push<T extends any[], V> = [ ...T, V ];
}

namespace Global.Iterables.Map {
    type Values<M extends Map<any, any>> = M extends Map<any, infer T> ? T : never; 
    type Keys<M extends Map<any, any>> = M extends Map<infer K, any> ? K : never; 

    type KeyValues<M extends Map<any, any>> = M extends Map<infer K, infer V>
        ? { key: K, value: V }
        : never;
}
