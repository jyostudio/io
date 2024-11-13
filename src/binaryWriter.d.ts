import List from "@jyostudio/list";
import { Encoding } from "@jyostudio/text";
import Stream from "./stream";
import SeekOrigin from "./seekOrigin";

/**
 * 将二进制中的基元类型写入流并支持用特定的编码写入字符串。
 * @class
 */
export default class BinaryWriter {
    /**
     * 指定无后备存储的 BinaryWriter。
     * @returns {BinaryWriter} 无后备存储的 BinaryWriter。
     */
    static get null(): BinaryWriter;

    /**
     * 获取 BinaryWriter 的基础流。
     * @returns {Stream} 与 BinaryWriter 关联的基础流。
     */
    get baseStream(): Stream;

    /**
     * 基于所指定的流和特定的 UTF-8 编码，初始化 BinaryWriter 类的新实例。
     * @param {Stream} output 输出流。
     * @returns {BinaryWriter} BinaryWriter 类的新实例。
     */
    constructor(output: Stream);

    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryWriter 类的新实例。
     * @param {Stream} output 输出流。
     * @param {Encoding} encoding 要使用的字符编码。
     * @returns {BinaryWriter} BinaryWriter 类的新实例。
     */
    constructor(output: Stream, encoding: Encoding);

    /**
     * 关闭当前的 BinaryWriter 和基础流。
     * @returns {void}
     */
    close(): void;

    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     * @returns {void}
     */
    flush(): void;

    /**
     * 设置当前流中的位置。
     * @param {Number} offset 相对于 origin 的字节偏移量。
     * @param {SeekOrigin} origin SeekOrigin 的一个字段，指示获取新位置所依据的参考点。
     * @returns {Number} 包含当前流的位置。
     */
    seek(offset: Number, origin: SeekOrigin): Number;

    /**
     * 将单字节 Boolean 值写入当前流，其中 0 表示 false，1 表示 true。
     * @param {Boolean} value 要写入的 Boolean 值（0 或 1）。
     * @returns {void}
     */
    writeBoolean(value: Boolean): void;

    /**
     * 将一个无符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param {Number} value 要写入的无符号字节。
     * @returns {void}
     */
    writeByte(value: Number): void;

    /**
     * 将字节数组写入基础流。
     * @param {Uint8Array} buffer 包含要写入的数据的字节数组。
     * @returns {void}
     */
    writeBytes(buffer: Uint8Array): void;

    /**
     * 将字节数组区域写入当前流。
     * @param {Uint8Array} buffer 包含要写入的数据的字节数组。
     * @param {Number} index 要从 buffer 中读取且要写入流的第一个字节的索引。
     * @param {Number} count 要从 buffer 中读取且要写入流的字节数。
     * @returns {void}
     */
    writeBytes(buffer: Uint8Array, index: Number, count: Number): void;

    /**
     * 将 Unicode 字符写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param {String} ch 要写入的非代理项 Unicode 字符。
     * @returns {void}
     */
    writeChar(ch: String): void;

    /**
     * 将字符数组写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param {List<String>} chars 包含要写入的数据的字符数组。
     * @returns {void}
     */
    writeChars(chars: List<String>): void;

    /**
     * 将字符数组部分写入当前流，并根据所使用的 Encoding（可能还根据向流中写入的特定字符），提升流的当前位置。
     * @param {List<String>} chars 包含要写入的数据的字符数组。
     * @param {Number} index 要从 chars 中读取且要写入流的第一个字符的索引。
     * @param {Number} count 要从 chars 中读取且要写入流的字符数。
     * @returns {void}
     */
    writeChars(chars: List<String>, index: Number, count: Number): void;

    /**
     * 将 8 字节浮点值写入当前流，并将流的位置提升 8 个字节。
     * @param {Number} value 要写入的 8 字节浮点值。
     * @returns {void}
     */
    writeDouble(value: Number): void;

    /**
     * 将 4 字节浮点值写入当前流，并将流的位置提升 4 个字节。
     * @param {Number} value 要写入的 4 字节浮点值。
     * @returns {void}
     */
    writeSingle(value: Number): void;

    /**
     * 将有长度前缀的字符串按 BinaryWriter 的当前编码写入此流，并根据所使用的编码和写入流的特定字符，提升流的当前位置。
     * @param {String} value 要写入的值。
     * @returns {void}
     */
    writeString(value: String): void;

    /**
     * 将 2 字节带符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param {Number} value 要写入的 2 字节带符号整数。
     * @returns {void}
     */
    writeInt16(value: Number): void;

    /**
     * 将 4 字节带符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param {Number} value 要写入的 4 字节带符号整数。
     * @returns {void}
     */
    writeInt32(value: Number): void;

    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param {Number} value 要写入的 8 字节带符号整数。
     * @returns {void}
     */
    writeInt64(value: Number): void;

    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param {BigInt} value 要写入的 8 字节带符号整数。
     * @returns {void}
     */
    writeInt64(value: BigInt): void;

    /**
     * 将一个带符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param {Number} value 要写入的带符号字节。
     * @returns {void}
     */
    writeSByte(value: Number): void;

    /**
     * 将 2 字节无符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param {Number} value 要写入的 2 字节无符号整数。
     * @returns {void}
     */
    writeUInt16(value: Number): void;

    /**
     * 将 4 字节无符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param {Number} value 要写入的 4 字节无符号整数。
     * @returns {void}
     */
    writeUInt32(value: Number): void;

    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param {Number} value 要写入的 8 字节无符号整数。
     * @returns {void}
     */
    writeUInt64(value: Number): void;

    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param {BigInt} value 要写入的 8 字节无符号整数。
     * @returns {void}
     */
    writeUInt64(value: BigInt): void;

    /**
     * 以压缩格式写入 32 位整数。
     * @param {Number} value 要写入的 32 位整数。
     * @returns {void}
     */
    write7BitEncodedInt(value: Number): void;
}