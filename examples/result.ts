import * as Struct from "../src/struct.js";

export declare module Result {
    type Ok<T> = { value: T; type: typeof Variants.Ok };
    type Err<E> = { error: E; type: typeof Variants.Err };
    type Variant<T, E> = Ok<T> | Err<E>;
    interface VariantHKT2 extends HKT2 {
        wrapper: Variant<this["type1"], this["type2"]>
    }
    type Match = <T, E, R>(f: Struct.ToFuncs<{ Ok: Result.Ok<T>, Err: Result.Err<E> }, R>) => (i: Result.Variant<T, E>) => R
}

const Variants = {
    Ok: <T, E>(value: T): Result.Variant<T, E> => ({
        value,
        type: Variants.Ok,
    }),
    Err: <T, E>(error: E): Result.Variant<T, E> => ({
        error,
        type: Variants.Err,
    }),
}

const Impl = {//monad doesn't work with double hkts
    match: Struct.match(Variants) as Result.Match,
}

const Monad: Monad2<Result.VariantHKT2> = {
    map: (f) => Impl.match({
        Ok: (s) => Variants.Ok(f(s.value)),
        Err: (e) => e,
    }),
    pure: Variants.Ok,
    apply: Impl.match({
        Ok: (s) => Monad.map(s.value),
        Err: (e) => (_) => e,
    }),
    fmap: (f) =>
        Impl.match({
            Ok: (s) => f(s.value),
            Err: (e) => e,
        }),
    join: Impl.match({
        Ok: (s) => s.value,
        Err: (e) => e,
    }),
    cat: Impl.match({
        Ok: (a) =>
            Impl.match({
                Ok: (b) => Variants.Ok(a.value.type.cat(a.value)(b.value)),
                Err: (_) => a,
            }),
        Err: () =>
            c => c
    }),
}

const Result = {
    ...Impl,
    ...Monad,
    ...Variants,
}

const x = Variants.Ok<number, string>(1)
const y = Result.map<number, number, string>((v: number) => v + 1)(x)