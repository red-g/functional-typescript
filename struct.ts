//structs, pattern matching support
export type Typed<T extends Struct<Typed<T>>> = {
  [K in keyof ReturnType<T> as Exclude<K, "type">]: ReturnType<T>[K];
} & { type: T };
export type Struct<S extends Typed<Struct<S>>> = (...args: any[]) => S;

export const isa = <S extends Struct<Typed<S>>>(
  t: S,
  i: Typed<any>
): i is Typed<S> => i.type === t;

export const match =
  <V extends { [key: string]: Struct<any> }>(variants: V) =>
  <F extends { 
    [K in keyof V]: Typed<V[K]>
  }, R>(
    funcs: { [K in keyof V]: (v: F[K]) => R }
  ) => {
    const paths = new Map(
      Object.keys(variants).map((k) => [variants[k], funcs[k]])
    );
    return (instance: F[keyof V]): R =>
      paths.get(instance.type)!(instance as any);
  };
