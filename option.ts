import * as Struct from "./struct.js";

//type declarations
export declare module Option {
  type Some<T> = { value: T; type: typeof Variants.Some };
  type None = { type: typeof Variants.None };
  type Variant<T> = Some<T> | None;
  interface VariantHKT extends HKT {
    wrapper: Variant<this["type"]>;
  }
}

//"trait" implementations
const Variants = {
  Some: <T>(value: T) => ({
    value,
    type: Variants.Some,
  }),
  None: () => Impl.none,
}

const Impl = {
  match: Struct.match(Variants),
  none: { type: Variants.None },
}

const Monad: Monad<Option.VariantHKT> = {
  map: (f) => Impl.match({
    Some: (s: any) => Variants.Some(f(s.value)),
    None: (n: any) => n,
  }),
  pure: Variants.Some,
  apply: Impl.match({
    Some: (s: any) => Option.map(s.value),
    None: (n) => (_: any) => n,
  }),
  empty: Impl.none,
  fmap: (f) =>
    Impl.match({
      Some: (s: any) => f(s.value),
      None: (n) => n,
    }),
  join: Impl.match({
    Some: (s: any) => s.value,
    None: (n) => n,
  }),
  cat: Impl.match({
    Some: (a: any) =>
      Impl.match({
        Some: (b) => Variants.Some(a.value.type.cat(a.value)(b.value)),
        None: (_) => a,
      }),
    None: (_) =>
      Impl.match({
        Some: (b: any) => b,
        None: (n) => n,
      }),
  }),
}

//combining the implementations into final export
export const Option = {
  ...Variants,
  ...Impl,
  ...Monad
};