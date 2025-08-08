import TextReader from "./textReader";

/**
 * 实现 TextReader ，使其从字符串读取。
 * @class
 */
export default class StringReader extends TextReader {
    /**
     * 新实例初始化 StringReader 读取指定的字符串中的类。
     * @param {String} s 字符串 StringReader 应进行初始化。
     * @returns {StringReader} StringReader 读取指定的字符串中的类。
     */
    constructor(s: String);

    /**
     * 关闭 StringReader。
     * @returns {void}
     */
    close(): void;

    /**
     * 返回下一个可用字符，但不使用它。
     * @returns {Number} 读取，表示下一个字符的整数或-1，如果没有更多的可用字符或者流不支持查找。
     */
    peek(): Number;

    /**
     * 输入字符串中读取下一个字符并将字符位置提升一个字符。
     * @returns {Number} 下一步中的字符基础字符串，或者如果没有更多的可用字符则为-1。
     */
    read(): Number;

    /**
     * 在输入字符串中读取的字符块，并通过将字符位置提升 count。
     * @param {Array<String>} buffer 此方法返回时，包含指定的字符数组，该数组的 index 和 (index + count - 1) 之间的值由从当前源中读取的字符替换。
     * @param {Number} index 缓冲区中的起始索引。
     * @param {Number} count 要读取的字符数。
     * @returns {Number} 读入缓冲区的总字符数。 这可以是小于的字符数请求如果许多字符当前不可用，或零个如果已到达基础字符串的末尾。
     */
    read(buffer: Array<String>, index: Number, count: Number): Number;

    /**
     * 读取从当前位置到字符串结尾的所有字符并将它们作为一个字符串返回。
     * @returns {String} 来自当前位置到基础字符串末尾的内容。
     */
    readToEnd(): String;

    /**
     * 从当前字符串中读取一行字符并返回数据作为字符串。
     * @returns {String} 从当前字符串的下一行或 null 如果已到达字符串的结尾。
     */
    readLine(): String;
}
