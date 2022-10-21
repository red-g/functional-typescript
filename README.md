# functional-typescript
A simple and flexible take on functional typescript programming.

This repo is my take on the some of the functional libraries and approaches to typescript & javascript that have been floating around for the past few years. I tried to aim for simplicity and ease of use, while also providing the core features that people have come to appreciate from the functional programming style.

## Features
Across the hkt, utils, and struct folders you will find the functionality and typing required for higher kinded types, pattern matching, structs, piping, and type classes.<br/>I provided the option file as an example of an implementation making use of these features, while the index file shows the library and option type in use.

## Creating an Enum
Since an enum variant is both a function and a type (ex: `Some(3)` returns a value of type `Some`), you need to export a module with the same name as your enum object which declares your variant types. The enum object is just an object filled with pure functions, chief among them the enum variant constructors, for example `Some` and `None` for the `Option` type.

Note that in the example we break up the enum definition into separate constant objects, as the `None` constructor always returns the singleton instance `none`, also stored on the enum object, causing a cyclical error if they were all defined in a single object. This technique also allows you to more easily implement existing interfaces while maintaining type safety, as we'll see later.
```
export declare module Option {
    type Some<T> = { value: T; type: typeof Variants.Some };
    type None = { type: typeof Variants.None };
    type Variant<T> = Some<T> | None;
}
const Impl = {
    none: { type: Variants.None }
}
const Variants = {
    Some: <T>(value: T) => ({
        value,
        type: Variants.Some,
    }),
    None: () => Impl.none,
}
const Option = {
    ...Impl,
    ...Variants,
}
```
## Branch Matching
Most of the heavy lifting is already out of the way. All we need to do is add the `match` function to our `Impl` object from the `Struct` module, passing it our `Variants` object for the variants to check against.

```
import * as Struct from "./struct.js";

const Impl = {
    none: { type: Variants.None },
    match: Struct.match(Variants),
}
```
Now we can match the different variants of our enum for a value of type `Option`!
```
const possiblyThree = Option.Some(3)
Option.match({
    Some: (s) => console.log("The number", s.value)
    None: (n) => console.log("Nada")
})(possiblyThree)
```
## Higher Kinded Types and Type Classes
Higher kinded types allow us to maintain type safety for common design patterns, like functors (map) or monads (flatMap). Take the type signature of map, for example: `(a => b) => (T<a> => T<b>)` (if you are only familiar with map in the context of arrays, imagine replacing `Array` with some arbitrary parameterized type). This is not expressable in typescript ordinarily. However, a number of clever work arounds have been developed, and this library uses one of the more minimal designs. To make the `Option` type a higher kinded type--what would be T in the prior example--we add a short second type, `OptionHKT` to our types module. Now to generate the type for the map function, we can pass `OptionHKT` to the `Functors` interface. This works due to the magic `this` keyword, which updates as the type changes.
```
export declare module Option {
  type Some<T> = { value: T; type: typeof Variants.Some };
  type None = { type: typeof Variants.None };
  type Variant<T> = Some<T> | None;
  interface VariantHKT extends HKT {
    wrapper: Variant<this["type"]>;
  }
}
```
Now we can implement our map function using the `Functor` interface from the `HKT` module. Once again, breaking up the enum objects comes in handy.
```
import { Functor } from "./hkt.d.ts";

const Functor: Functor<OptionHKT> = {
    map: (f) => Impl.match({
        Some: (s) => Variants.Some(f(s.value)),
        None: (n) => n,
    }),
}
export const Option = {
    ...Impl,
    ...Variants,
    ...Functor
}
```

## Future Plans
This project is still in its very early stages but I hope that I won't have to add much more, since the building blocks its provides should be flexible enough for most situations. With that said, an immediate goal is to add in automatically implemented methods with type classes (like first for an iterable, etc). Additionally, match's type inference isn't very helpful for generic types like `Some`, so hopefully it can be rewritten to better predict.
