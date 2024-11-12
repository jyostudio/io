import TextWriter from "./textWriter";
import { Encoding, StringBuilder } from "@jyostudio/text";

/**
 * 实现 TextWriter 用于将字符写入到流中特定的编码。
 * @class
 */
export default class StringWriter extends TextWriter {
    /**
     * 获取在其中写入输出的 Encoding。
     * @returns {Encoding} 在其中写入输出的 Encoding。
     */
    get encoding(): Encoding;

    /**
     * 初始化 StringWriter 类的新实例。
     * @returns {StringWriter} StringWriter 类的新实例。
     */
    constructor();

    /**
     * 初始化写入到指定的 StringBuilder 中的 StringWriter 类的新实例。
     * @param {StringBuilder} stringBuilder 要写入的 StringBuilder 对象。
     * @returns {StringWriter} StringWriter 类的新实例。
     */
    constructor(stringBuilder: StringBuilder);

    /**
     * 关闭当前 StringWriter 和基础流。
     * @returns {void}
     */
    close(): void;

    /**
     * 返回基础 StringBuilder。
     * @returns {StringBuilder} 基础 StringBuilder。
     */
    getStringBuilder(): StringBuilder;

    /**
     * 返回包含迄今为止写入到当前 StringWriter 中的字符的字符串。
     * @returns {String} 包含写入到当前 StringWriter 中的字符的字符串。
     */
    toString(): String;

    /**
     * 将字符串写入当前字符串。
     * @param {String} value 要写入的字符串。
     * @returns {void}
     */
    write(value: String): void;

    /**
     * 将字符的子数组写入字符串。
     * @param {Array<String>} buffer 要从中写出数据的字符数组。
     * @param {Number} index 缓冲区中开始读取数据的位置。
     * @param {Number} count 要写入的最大字符数。
     * @returns {void}
     */
    write(buffer: Array<String>, index: Number, count: Number): void;
}
