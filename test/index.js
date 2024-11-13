import * as IO from "../src/index.js";

console.dir(IO);

const Path = IO.Path;

console.dir(Path);

let res = Path.combine("a", "b", "c");
console.dir(res);