//Higher kinded types implementation. To create your own just write
//  interface MyTypeHKT extends HKT {
//    wrapper: MyType<this["type"]>;
//  }
type HKT = { type: unknown; wrapper: unknown };
type Kind<W, T> = W extends HKT ? (W & { type: T })["wrapper"] : W;

//multiple type parameters can be achieved by nesting 
/*type MyType<A, B> = A | B
interface MyTypeHKT<T> extends HKT {
   wrapper: MyType<T, this["type"]>;
 }
  interface MyTypeHKT2 extends HKT {
    wrapper: MyTypeHKT<this["type"]>;
  }

type TestMyType = Kind<Kind<MyTypeHKT2, number>, string>;*/

//Standard typeclasses, utilizing HKTs
interface Functor<T> {
  map<I, O>(f: (v: I) => O): (v: Kind<T, I>) => Kind<T, O>;
}

interface Applicative<T> extends Functor<T> {
  pure<I>(v: I): Kind<T, I>;
  apply<I, O>(f: Kind<T, (v: I) => O>): (v: Kind<T, I>) => Kind<T, O>;
}

interface Monad<T> extends Applicative<T> {
  cat<C extends { type: Cat<C> }>(
    a: Kind<T, C>
  ): (b: Kind<T, C>) => Kind<T, C>;
  fmap<I, O>(f: (v: I) => Kind<T, O>): (v: Kind<T, I>) => Kind<T, O>;
  join<I>(v: Kind<T, Kind<T, I>>): Kind<T, I>;
}

interface Cat<T> {
  cat: (a: T) => (b: T) => T;
}

type HKT2 = { type1: unknown; type2: unknown; wrapper: unknown };
type Kind2<W, T1, T2> = W extends HKT2 ? (W & { type1: T1; type2: T2 })["wrapper"] : W;

interface Functor2<T> {
  map<I, O, T2>(f: (v: I) => O): (v: Kind2<T, I, T2>) => Kind2<T, O, T2>;
}

interface Applicative2<T> extends Functor2<T> {
  pure<I, T2>(v: I): Kind2<T, I, T2>;
  apply<I, O, T2>(f: Kind2<T, (v: I) => O, T2>): (
    v: Kind2<T, I, T2>
  ) => Kind2<T, O, T2>;
}

interface Monad2<T> extends Applicative2<T> {
  cat<C extends { type: Cat<C> }, T2>(a: Kind2<T, C, T2>): (
    b: Kind2<T, C, T2>
  ) => Kind2<T, C, T2>;
  fmap<I, O, T2>(f: (v: I) => Kind2<T, O, T2>): (
    v: Kind2<T, I, T2>
  ) => Kind2<T, O, T2>;
  join<I, T2>(v: Kind2<T, Kind2<T, I, T2>, T2>): Kind2<T, I, T2>;
}

declare module MultiArg {
  interface Functor<T> {
    map<I, O>(f: (v: I) => O, v: Kind<T, I>): Kind<T, O>;
  }
  interface Applicative<T> extends Functor<T> {
    pure<I>(v: I): Kind<T, I>;
    apply<I, O>(f: Kind<T, (v: I) => O>, v: Kind<T, I>): Kind<T, O>;
  }
  interface Monad<T> extends Applicative<T> {
    cat<C extends { type: Cat<C> }>(
      a: Kind<T, C>,
      b: Kind<T, C>
    ): Kind<T, C>;
    fmap<I, O>(f: (v: I) => Kind<T, O>, v: Kind<T, I>): Kind<T, O>;
    join<I>(v: Kind<T, Kind<T, I>>): Kind<T, I>;
  }
}