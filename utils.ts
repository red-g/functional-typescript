//Standard pipe utilities, designed for optimal type inference
export const Pipe = <I>(value: I) => {
    const apply = <O>(f: (v: I) => O) => Pipe(f(apply.value));
    apply.value = value;
    return apply;
  };
//Ex: Pipe(1)(v => v + 1)(v => v * 2).value === 4
export const Chain = <I, O>(func: (v: I) => O) => {
    const combine = <N>(g: (v: O) => N) => Chain((x: I) => g(combine.func(x)))
    combine.func = func
    return combine;
}
//Ex: Chain((v: number) => v + 1)((v) => v * 2)(1).func === 4