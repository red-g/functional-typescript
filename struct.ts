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
/*module Test {
  const Some = <T>(value: T) => ({
    type: Some,
    value,
  });

  const None = () => none;
  const none = { type: None };

  const SomeOrNone = <T>(value: T) => (value ? Some(value) : None());

  let x = SomeOrNone(1);
  if (Obj.isa(Some, x)) {
    console.log(x.value);
  } else {
    console.log("None");
  }
  const Option = { Some: Some as typeof Some<any>, None };
  let z = Obj.match(Option)({
    Some: (s: Obj.Typed<typeof Some<number>>) => s.value,
    None: (n) => 1,
  })(none);

  console.log(z);
}*/
