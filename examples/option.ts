import * as Struct from "../src/struct.js";

//type declarations
export declare module Option {
  type Some<T> = { value: T; type: typeof Variants.Some };
  type None = { type: typeof Variants.None };
  type Variant<T> = Some<T> | None;
  interface VariantHKT extends HKT {
    wrapper: Variant<this["type"]>;
  }
  type Match = <T, R>(f: Struct.ToFuncs<{ Some: Option.Some<T>, None: Option.None }, R>) => (i: Option.Variant<T>) => R
}

const Some = {
  unwrap: <T>(s: Option.Some<T>) => s.value,
}

//"trait" implementations
const Variants = {
  Some: <T>(value: T): Option.Variant<T> => ({
    value,
    type: Variants.Some,
  }),
  None: <T>(): Option.Variant<T> => Impl.none,
}

const Impl = {
  match: Struct.match(Variants) as Option.Match,
  none: { type: Variants.None },
}

const Monad: Monad<Option.VariantHKT> = {
  map: (f) => Impl.match({
    Some: (s) => Variants.Some(f(s.value)),
    None: (n) => n,
  }),
  pure: Variants.Some,
  apply: Impl.match({
    Some: (s) => Option.map(s.value),
    None: (n) => (_) => n,
  }),
  fmap: (f) =>
    Impl.match({
      Some: (s) => f(s.value),
      None: (n) => n,
    }),
  join: Impl.match({
    Some: (s) => s.value,
    None: (n) => n,
  }),
  cat: Impl.match({
    Some: (a) =>
      Impl.match({
        Some: (b) => Variants.Some(a.value.type.cat(a.value)(b.value)),
        None: () => a,
      }),
    None: () =>
      c => c
  }),
}

//combining the implementations into final export
//consider exporting every module to prevent name collisions
export const Option = {
  ...Monad,
  ...Variants,
  ...Impl,
};
