/**
 * 设置实例的释放状态
 * 该方法会将实例的所有方法和属性设置为不可用状态，
 * 以防止在实例被释放后继续调用其方法或访问其属性。
 * @param inst 实例对象
 */
export function setDisposeStatus(inst: any): void {
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(inst))) {
        try {
            if (key === "constructor") continue;
            if (typeof inst[key] === "function") {
                inst[key] = () => {
                    throw new Error("实例已被释放，无法调用方法。");
                };
            } else if (key !== "constructor") {
                Object.defineProperty(inst, key, {
                    get: () => {
                        throw new Error("实例已被释放，无法访问属性。");
                    },
                    set: () => {
                        throw new Error("实例已被释放，无法设置属性。");
                    }
                });
            }
        } catch { }
    }
}