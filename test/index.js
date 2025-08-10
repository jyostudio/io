import * as IO from "../dist/index.js";

const m = new IO.MemoryStream();
console.dir(Object.getOwnPropertyNames(Object.getPrototypeOf(m)));
for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(m))) {
    if (key === "constructor") continue;
    if (typeof (m)[key] === "function") {
        (m)[key] = () => {
            throw new EvalError("无法调用已释放的流方法。");
        };
    } else {
        Object.defineProperty(m, key, {
            get: () => {
                throw new EvalError("无法访问已释放的流。");
            },
            set: () => {
                throw new EvalError("无法设置已释放的流属性。");
            }
        });
    }
}
m.close();
m.capacity = "abc";