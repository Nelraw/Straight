
declare namespace Iterables {

    type Iterable<T> = T[Symbol.iterator] extends Symbol.iterator ? T : never;
    type Iterator<T> = T extends Iterable<T> ? T[Symbol.iterator] : never;

    type Values<T extends Iterable<T>> = T extends any[]
        ? Array.Values<T>
        : Map.Values<T>;

    type First<T extends any[]> = T extends [ infer U, ...any[] ] ? U : never;
    type Last<T extends any[]> = T['length'] extends infer L ? T[L] : never;

    type Rest<T extends any[]> = T extends [ infer A, ...infer Rest ] ? Rest : never;

    type Concat<T extends any[], U extends any[]> = [ ...T, ...U ];

    namespace Array {
        type Values<T extends Array<infer VT>> = VT;
    
        type Callback<OT, RT = any> = (object: OT, index?: number, array?: Array<OT>) => RT;
        type Matcher<OT> = (...args: Parameters<Callback<OT>>) => boolean;
        type Mapper<OT, RT = any> = (...args: Parameters<Callback<OT>>) => RT;
    }
    
    namespace Map {
        type Values<M extends Map<any, infer VT>> = VT; 
        type Keys<M extends Map<infer KT, any>> = KT; 

        type KeyValues<M extends Map<infer KT, infer VT>> = { key: KT, value: VT };
    }
}
