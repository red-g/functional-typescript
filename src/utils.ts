//Standard pipe utilities, designed for optimal type inference
export const pipe = <I>(value: I) => {
  const apply = <O>(f: (v: I) => O) => pipe(f(apply.value));
  apply.value = value;
  return apply;
};
//Ex: Pipe(1)(v => v + 1)(v => v * 2).value === 4
export const chain = <I, O>(func: (v: I) => O) => {
  const combine = <N>(g: (v: O) => N) => chain((x: I) => g(combine.func(x)))
  combine.func = func
  return combine;
}
//Ex: Chain((v: number) => v + 1)(v => v * 2)(1).func === 4