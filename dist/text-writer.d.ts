import { Encoding } from "@jyostudio/text";
declare const CONSTRUCTOR_SYMBOL: unique symbol;
/**
 * 表示可以编写一个有序字符系列的编写器。
 */
export default abstract class TextWriter {
    #private;
    /**
     * 提供 TextWriter，它不带任何可写入但无法从中读取的后备存储。
     * @returns 无后备存储的 TextWriter。
     */
    static get null(): NullTextWriter;
    /**
     * 获取由当前 TextWriter 使用的行结束符字符串。
     * @returns 当前 TextWriter 的行结束符字符串。
     */
    get newLine(): string;
    /**
     * 设置由当前 TextWriter 使用的行结束符字符串。
     * @param value 当前 TextWriter 的行结束符字符串。
     */
    set newLine(value: string);
    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    abstract get encoding(): Encoding;
    /**
     * 基于所指定的构造参数，初始化 TextWriter 类的新实例。
     */
    constructor();
    private static [CONSTRUCTOR_SYMBOL];
    /**
     * 关闭当前编写器并释放任何与该编写器关联的系统资源。
     */
    close(): void;
    /**
     * 释放此写入器使用的所有资源。
     */
    [Symbol.dispose](): void;
    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     */
    flush(): void;
    /**
     * 将字节数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字节数组。
     */
    write(buffer: Uint8Array): void;
    /**
     * 将字符数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字符数组。
     */
    write(buffer: Array<string>): void;
    /**
     * 将字符的子数组写入文本字符串或流。
     * @param buffer 要从中写出数据的字符数组。
     * @param index 在开始接收数据时缓存中的字符位置。
     * @param count 要写入的字符数。
     */
    write(buffer: Array<string>, index: number, count: number): void;
    /**
     * 将 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    write(value: boolean): void;
    /**
     * 将数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    write(value: number): void;
    /**
     * 将字符串写入到文本字符串或流。
     * @param value 要写入的字符串。
     */
    write(value: string): void;
    /**
     * 通过在对象上调用 toString 方法将此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    write(value: object): void;
    /**
     * 将行结束符的字符串写入文本字符串或流。
     */
    writeLine(): void;
    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param value 要写入的字符串。
     */
    writeLine(value: string): void;
    /**
     * 将后跟行结束符的字符数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     */
    writeLine(buffer: Array<string>): void;
    /**
     * 将后跟行结束符的字符子数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     * @param index 在开始读取数据时 buffer 中的字符位置。
     * @param count 要写入的最大字符数。
     */
    writeLine(buffer: Array<string>, index: number, count: number): void;
    /**
     * 将后面带有行结束符的 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    writeLine(value: boolean): void;
    /**
     * 将后跟行结束符的数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    writeLine(value: number): void;
    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    writeLine(value: object): void;
}
/**
 * 不带任何可写入但无法从中读取的后备存储 TextWriter。
 */
declare class NullTextWriter extends TextWriter {
    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    get encoding(): Encoding;
    /**
     * 将字符数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字符数组。
     */
    write(buffer: Array<string>): void;
    /**
     * 将字符的子数组写入文本字符串或流。
     * @param buffer 要从中写出数据的字符数组。
     * @param index 在开始接收数据时缓存中的字符位置。
     * @param count 要写入的字符数。
     */
    write(buffer: Array<string>, index: number, count: number): void;
    /**
     * 将 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    write(value: boolean): void;
    /**
     * 将数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    write(value: number): void;
    /**
     * 将字符串写入到文本字符串或流。
     * @param value 要写入的字符串。
     */
    write(value: string): void;
    /**
     * 通过在对象上调用 toString 方法将此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    write(value: object): void;
    /**
     * 将行结束符的字符串写入文本字符串或流。
     */
    writeLine(): void;
    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param value 要写入的字符串。
     */
    writeLine(value: string): void;
    /**
     * 将后跟行结束符的字符数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     */
    writeLine(buffer: Array<string>): void;
    /**
     * 将后跟行结束符的字符子数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     * @param index 在开始读取数据时 buffer 中的字符位置。
     * @param count 要写入的最大字符数。
     */
    writeLine(buffer: Array<string>, index: number, count: number): void;
    /**
     * 将后面带有行结束符的 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    writeLine(value: boolean): void;
    /**
     * 将后跟行结束符的数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    writeLine(value: number): void;
    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    writeLine(value: object): void;
}
export {};
//# sourceMappingURL=text-writer.d.ts.map