
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
    type AsyncCallback<OT, RT = any> = (object: OT, index?: number, array?: Array<OT>) => Promise<RT>;

    // type Matcher<OT> = (...args: Parameters<Callback<OT>>) => boolean;
    // type AsyncMatcher<OT> = (...args: Parameters<Callback<OT>>) => Promise<boolean>;
    type Matcher<OT> = Callback<OT, boolean>;
    type AsyncMatcher<OT> = AsyncCallback<OT, boolean>;

    // type Finder<OT> = (...args: Parameters<Callback<OT>>) => OT | undefined;
    // type AsyncFinder<OT> = (...args: Parameters<Callback<OT>>) => Promise<OT | undefined>;

    type Finder<OT> = Callback<OT, OT | undefined>;
    type AsyncFinder<OT> = AsyncCallback<OT, OT | undefined>;

    // type Mapper<OT, RT = any> = (...args: Parameters<Callback<OT>>) => RT;
    // type AsyncMapper<OT, RT = any> = (...args: Parameters<Callback<OT>>) => Promise<RT>;

    type Mapper<OT, RT = any> = Callback<OT, RT>;
    type AsyncMapper<OT, RT = any> = AsyncCallback<OT, RT>;

    type Push<T extends any[], V> = [ ...T, V ];
}

namespace Global.Iterables.Map {
    type Values<M extends Map<any, any>> = M extends Map<any, infer T> ? T : never; 
    type Keys<M extends Map<any, any>> = M extends Map<infer K, any> ? K : never; 

    type KeyValues<M extends Map<any, any>> = M extends Map<infer K, infer V>
        ? { key: K, value: V }
        : never;
}
