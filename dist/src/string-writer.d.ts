import { Encoding, StringBuilder } from "@jyostudio/text";
import TextWriter from "./text-writer";
declare const CONSTRUCTOR_SYMBOL: unique symbol;
/**
 * 实现 TextWriter 用于将字符写入到字符串中。
 */
export default class StringWriter extends TextWriter {
    #private;
    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    get encoding(): Encoding;
    /**
     * 初始化 StringWriter 类的新实例，使用默认的 StringBuilder。
     */
    constructor();
    /**
     * 使用指定的 StringBuilder 初始化 StringWriter 类的新实例。
     * @param sb 要写入的 StringBuilder。
     */
    constructor(sb: StringBuilder);
    private static [CONSTRUCTOR_SYMBOL];
    /**
     * 关闭当前 StringWriter 并释放任何与该 StringWriter 关联的系统资源。
     */
    close(): void;
    /**
     * 释放此字符串写入器使用的所有资源。
     */
    [Symbol.dispose](): void;
    /**
     * 返回此 StringWriter 写入的基础 StringBuilder。
     * @returns 基础 StringBuilder。
     */
    getStringBuilder(): StringBuilder;
    /**
     * 返回包含到此为止写入当前 StringWriter 的字符的字符串。
     * @returns 包含到此为止写入当前 StringWriter 的字符的字符串。
     */
    toString(): string;
    write(...params: any): any;
}
export {};
//# sourceMappingURL=string-writer.d.ts.map