import { Encoding } from "@jyostudio/text";

/**
 * 表示可以编写一个有序字符系列的编写器。 此类为抽象类。
 * @class
 */
export default class TextWriter {
    /**
     * 提供 TextWriter，它不带任何可写入但无法从中读取的后备存储。
     */
    static readonly null: NullTextWriter;

    /**
     * 获取由当前 TextWriter 使用的行结束符字符串。
     * @returns {String} 当前 TextWriter 的行结束符字符串。
     */
    get newLine(): String;

    /**
     * 设置由当前 TextWriter 使用的行结束符字符串。
     * @param {String} value 当前 TextWriter 的行结束符字符串。
     */
    set newLine(value: String);

    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns {Encoding} 用来写入输出的字符编码。
     */
    get encoding(): Encoding;

    /**
     * 初始化 TextWriter 类的新实例。
     * @returns {TextWriter} TextWriter 类的新实例。
     */
    constructor();

    /**
     * 关闭当前编写器并释放任何与该编写器关联的系统资源。
     * @returns {void}
     */
    close(): void;

    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     * @returns {void}
     */
    flush(): void;

    /**
     * 将字符数组写入该文本字符串或流。
     * @param {Array<String>} buffer 要写入文本流中的字符数组。
     * @returns {void}
     */
    write(buffer: Array<String>): void;

    /**
     * 将字符的子数组写入文本字符串或流。
     * @param {Array<String>} buffer 要从中写出数据的字符数组。
     * @param {Number} index 在开始接收数据时缓存中的字符位置。
     * @param {Number} count 要写入的字符数。
     * @returns {void}
     */
    write(buffer: Array<String>, index: Number, count: Number): void;

    /**
     * 将 Boolean 值的文本表示形式写入文本字符串或流。
     * @param {Boolean} value 要写入的 Boolean 值。
     * @returns {void}
     */
    write(value: Boolean): void;

    /**
     * 整数的文本表示形式写入文本字符串或流。
     * @param {Number} value 要写入的整数。
     * @returns {void}
     */
    write(value: Number): void;

    /**
     * 将字符串写入到文本字符串或流。
     * @param {String} value 要写入的字符串。
     * @returns {void}
     */
    write(value: String): void;

    /**
     * 通过在对象上调用 ToString 方法将此对象的文本表示形式写入文本字符串或流。
     * @param {Object} value 要写入的对象。
     * @returns {void}
     */
    write(value: Object): void;

    /**
     * 将行结束符的字符串写入文本字符串或流。
     * @returns {void}
     */
    writeLine(): void;

    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param {String} value 要写入的字符串。
     * @returns {void}
     */
    writeLine(value: String): void;

    /**
     * 将后跟行结束符的字符数组写入文本字符串或流。
     * @param {Array<String>} buffer 从其读取数据的字符数组。
     * @returns {void}
     */
    writeLine(buffer: Array<String>): void;

    /**
     * 将后跟行结束符的字符子数组写入文本字符串或流。
     * @param {Array<String>} buffer 从其读取数据的字符数组。
     * @param {Number} index 在开始读取数据时 buffer 中的字符位置。
     * @param {Number} count 要写入的最大字符数。
     * @returns {void}
     */
    writeLine(buffer: Array<String>, index: Number, count: Number): void;

    /**
     * 将后面带有行结束符的 Boolean 值的文本表示形式写入文本字符串或流。
     * @param {Boolean} value 要写入的 Boolean 值。
     * @returns {void}
     */
    writeLine(value: Boolean): void;

    /**
     * 将后跟行结束符的整数的文本表示形式写入文本字符串或流。
     * @param {Number} value 要写入的整数。
     * @returns {void}
     */
    writeLine(value: Number): void;

    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param {Object} value 要写入的对象。
     * @returns {void}
     */
    writeLine(value: Object): void;
}

/**
 * 不带任何可写入但无法从中读取的后备存储 TextReader。
 * @class
 */
export class NullTextWriter extends TextWriter {
    /**
     * 将字符的子数组写入文本字符串或流。
     * @override
     * @param {Array<String>} buffer 要从中写出数据的字符数组。
     * @param {Number} index 在开始接收数据时缓存中的字符位置。
     * @param {Number} count 要写入的字符数。
     * @returns {void}
     */
    write(buffer: Array<String>, index: Number, count: Number): void;

    /**
     * 将字符串写入到文本字符串或流。
     * @param {String} value 要写入的字符串。
     * @returns {void}
     */
    write(value: String): void;

    /**
     * 将行结束符的字符串写入文本字符串或流。
     * @returns {void}
     */
    writeLine(): void;

    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param {String} value 要写入的字符串。
     * @returns {void}
     */
    writeLine(value: String): void;

    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param {Object} value 要写入的对象。
     * @returns {void}
     */
    writeLine(value: Object): void;
}
