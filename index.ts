//Some test examples of repo's functional utilities
import { Option } from "./option.js";

let z = Option.map((x: number) => x + 1)(Option.Some(3));
//Some(4)
console.log("Mapping", z);

type Struct = ((value: number) => Instance) & Cat<Instance>;
type Instance = {
  type: Struct;
  value: number;
}

const Num: Struct = (value: number) => ({
  type: Num,
  value,
});

Num.cat = (a) => (b) => Num(a.value + b.value);

let x = Option.cat(Option.Some(Num(1)))(Option.Some(Num(2)));
//Some(3)
console.log("Concatenating", x);

import { Pipe, Chain } from "./utils.js";

let w = Pipe(3)
    (x => x + 1)
    (x => x.toString())
    (x => x + "!")
    (x => x.length)
    (x => x + 2)
    .value;
  //4
  console.log("Piping", w)
  
  let pf = Chain
    ((x: number) => x + 1)
    (x => x.toString())
    (x => x + "!")
    (x => x.length)
    (x => x + 2)
    .func;
  let p = pf(3)
  //4
  console.log("Chaining", p)