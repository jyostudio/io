import overload from "@jyostudio/overload";

/**
 * 检查设置器参数的类型。
 * @template This 设置器的 this 类型。
 * @template Args 设置器参数的类型。
 */
const setterTypeCheckers: WeakMap<Function, Function> = new WeakMap<Function, Function>();

/**
 * 检查设置器参数的类型。
 * @param type 设置器参数的类型检查器。
 * @template This 设置器的 this 类型。
 * @template Args 设置器参数的类型。
 * @template Return 设置器返回值的类型。
 * @returns 设置器装饰器。
 */
export function checkSetterType<This, Args extends any[], Return>(type: Function): Function {
    /**
     * 如果类型检查器不存在，则创建一个新的类型检查器并存储在 WeakMap 中。
     */
    if (!setterTypeCheckers.has(type)) {
        setterTypeCheckers.set(type, overload([type], function () { }));
    }

    /**
     * 创建设置器装饰器。
     * @param target 设置器函数。
     * @param context 设置器上下文。
     * @returns 返回一个新的函数，该函数在调用时会执行类型检查。
     * @template This 设置器的 this 类型。
     * @template Args 设置器参数的类型。
     * @template Return 设置器返回值的类型。
     */
    return function <This, Args extends any[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassSetterDecoratorContext<This, Object>
    ): Function {

        /**
         * 返回一个新的函数，该函数在调用时会执行类型检查。
         * @param this 设置器的 this 上下文。
         * @param args 设置器的参数。
         * @returns 返回设置器的返回值。
         */
        return function (this: This, ...args: Args): Return {
            const checker = setterTypeCheckers.get(type);
            if (checker) {
                checker(...args);
            }
            const result = target.call(this, ...args);
            return result;
        }
    }
}