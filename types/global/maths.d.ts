
namespace Global.Maths {

    type Sign = `+` | `-` ;
    type Signs = { plus: `+`;  minus: `-` };

    type Integer<T extends number, P extends boolean = true> = `${T}` extends `${string}.${string}`
        ? never
        : P extends true ? Positive<T> : never;

    type Positive<T extends number> = `${T}` extends `-${string}` ? never : T;
    type Negative<T extends number> = `${T}` extends `-${string}` ? T : never;

    // type Add<A extends number, B extends number = 1> = [ ...Array<A>, ...Array<B> ]['length'];

    // type Int<V extends number = 1> = Range extends infer INT ? Extract<INT, V> : never; 

    // type Range<A extends number[] = []> = A['length'] extends 999
    //     ? A[number]
    //     : Range<[...A, A['length']]>;

    // type Add<F extends number = 0, S extends number = 1> = Range extends infer R
    //     ? Extract<Range, Node.Objects.Iterables.Length<Node.Objects.Iterables.Concat<[  ]>>> : never; 

    // type Subtract<A extends number, B extends number> = 
    //     [...Array<A>]['length'] extends [...Array<B>]['length'] ? 0 : Exclude<A, B>;

}
