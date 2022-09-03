//Higher kinded types implementation. To create your own just write
//  interface MyTypeHKT extends HKT {
//    wrapper: MyType<this["type"]>;
//  }
type HKT = { type: unknown; wrapper: unknown };
type Kind<W extends HKT, T> = (W & { type: T })["wrapper"];

//Standard typeclasses, utilizing HKTs
interface Functor<T extends HKT> {
  map<I, O>(f: (v: I) => O): (v: Kind<T, I>) => Kind<T, O>;
}

interface Applicative<T extends HKT> extends Functor<T> {
  pure<I>(v: I): Kind<T, I>;
  apply<I, O>(f: Kind<T, (v: I) => O>): (v: Kind<T, I>) => Kind<T, O>;
}

interface Monad<T extends HKT> extends Applicative<T> {
  empty: Kind<T, any>;
  cat: <C extends { type: Cat<C> }>(
    a: Kind<T, C>
  ) => (b: Kind<T, C>) => Kind<T, C>;
  fmap<I, O>(f: (v: I) => Kind<T, O>): (v: Kind<T, I>) => Kind<T, O>;
  join<I>(v: Kind<T, Kind<T, I>>): Kind<T, I>;
}

interface Cat<T> {
  cat: (a: T) => (b: T) => T;
}