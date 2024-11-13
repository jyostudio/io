/**
 * 表示可读取有序字符系列的读取器。
 * @class
 */
export default class TextReader {
    /**
     * 提供一个无数据可供读取的 TextReader。
     */
    static readonly null: NullTextReader;

    /**
     * 初始化 TextReader 类的新实例。
     * @returns {TextReader} TextReader 类的新实例。
     */
    constructor();

    /**
     * 关闭 TextReader 并释放与该 TextReader 关联的所有系统资源。
     * @returns {void}
     */
    close(): void;

    /**
     * 读取下一个字符，而不更改读取器状态或字符源。 返回下一个可用字符，而实际上并不从读取器中读取此字符。
     * @returns {Number} 一个表示下一个要读取的字符的整数；如果没有更多可读取的字符或该读取器不支持查找，则为 -1。
     */
    peek(): Number;

    /**
     * 读取文本读取器中的下一个字符并使该字符的位置前移一个字符。
     * @returns {Number} 文本读取器中的下一个字符，或为 -1（如果没有更多可用字符）。 默认实现将返回 -1。
     */
    read(): Number;

    /**
     * 从当前读取器中读取指定数目的字符并从指定索引开始将该数据写入缓冲区。
     * @param {Array<String>} buffer 此方法返回时，包含指定的字符数组，该数组的 index 和 (index + count - 1) 之间的值由从当前源中读取的字符替换。
     * @param {Number} index 在 buffer 中开始写入的位置。
     * @param {Number} count 要读取的最大字符数。 如果在将指定数量的字符读入缓冲区之前就已达读取器的末尾，则返回该方法。
     * @returns {Number} 已读取的字符数。 该数会小于或等于 count，具体取决于读取器中是否有可用的数据。 如果调用此方法时没有留下更多的字符供读取，则此方法返回 0（零）。
     */
    read(buffer: Array<String>, index: Number, count: Number): Number;

    /**
     * 读取从当前位置到文本读取器末尾的所有字符并将它们作为一个字符串返回。
     * @returns {String} 一个包含从当前位置到文本读取器末尾的所有字符的字符串。
     */
    readToEnd(): String;

    /**
     * 从当前文本读取器中读取指定的最大字符数并从指定索引处开始将该数据写入缓冲区。
     * @param {Array<String>} buffer 此方法返回时，此参数包含指定的字符数组，该数组中从 index 到 (index + count -1) 之间的值由从当前源中读取的字符替换。
     * @param {Number} index 在 buffer 中开始写入的位置。
     * @param {Number} count 要读取的最大字符数。
     * @returns {Number} 已读取的字符数。 该数字将小于或等于 count，取决于是否所有的输入字符都已读取。
     */
    readBlock(buffer: Array<String>, index: Number, count: Number): Number;

    /**
     * 从文本读取器中读取一行字符并将数据作为字符串返回。
     * @returns {String} 读取器中的下一行，或 null（如果已读取所有字符）。
     */
    readLine(): String;
}

/**
 * 无数据可供读取的 TextReader。
 * @class
 */
export class NullTextReader extends TextReader {
    /**
     * 读取文本读取器中的下一个字符并使该字符的位置前移一个字符。
     * @returns {Number} 文本读取器中的下一个字符，或为 -1（如果没有更多可用字符）。 默认实现将返回 -1。
     */
    read(): Number;

    /**
     * 从当前读取器中读取指定数目的字符并从指定索引开始将该数据写入缓冲区。
     * @param {Array<String>} buffer 此方法返回时，包含指定的字符数组，该数组的 index 和 (index + count - 1) 之间的值由从当前源中读取的字符替换。
     * @param {Number} index 在 buffer 中开始写入的位置。
     * @param {Number} count 要读取的最大字符数。 如果在将指定数量的字符读入缓冲区之前就已达读取器的末尾，则返回该方法。
     * @returns {Number} 已读取的字符数。 该数会小于或等于 count，具体取决于读取器中是否有可用的数据。 如果调用此方法时没有留下更多的字符供读取，则此方法返回 0（零）。
     */
    read(buffer: Array<String>, index: Number, count: Number): Number;

    /**
     * 从文本读取器中读取一行字符并将数据作为字符串返回。
     * @returns {String} 读取器中的下一行，或 null（如果已读取所有字符）。
     */
    readLine(): String;
}
