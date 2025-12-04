import { Encoding } from "@jyostudio/text";
import Stream from "./stream";
declare const CONSTRUCTOR_SYMBOL: unique symbol;
/**
 * 用特定的编码将基元数据类型读作二进制值。
 */
export default class BinaryReader {
    #private;
    /**
     * 获取一个值，该值指示当前流是否使用大端字节序。
     * @returns 如果流使用大端字节序，则为 true；否则为 false。
     */
    get bigEndian(): boolean;
    /**
     * 设置一个值，该值指示当前流是否使用大端字节序。
     * @param value 如果流使用大端字节序，则为 true；否则为 false。
     */
    set bigEndian(value: boolean);
    /**
     * 公开对 BinaryReader 的基础流的访问。
     * @returns 与 BinaryReader 关联的基础流。
     */
    get baseStream(): Stream | null;
    /**
     * 基于所指定的流和特定的 UTF-8 编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     */
    constructor(input: Stream);
    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     * @param encoding 要使用的字符编码。
     */
    constructor(input: Stream, encoding: Encoding);
    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     * @param encoding 要使用的字符编码。
     * @param bigEndian 是否使用大端字节序。
     */
    constructor(input: Stream, encoding: Encoding, bigEndian: boolean);
    private static [CONSTRUCTOR_SYMBOL];
    /**
     * 释放此读取器使用的所有资源。
     */
    [Symbol.dispose](): void;
    /**
     * 关闭当前阅读器及基础流。
     */
    close(): void;
    /**
     * 返回下一个可用的字符，并且不提升字节或字符的位置。
     * @returns 下一个可用的字符，或者，如果没有可用字符或者流不支持查找时为 -1。
     */
    peekChar(): number;
    /**
     * 从基础流中读取字符，并根据所使用的 Encoding 和从流中读取的特定字符，提升流的当前位置。
     * @returns 输入流中的下一个字符，如果当前无可用字符则为 -1。
     */
    read(): number;
    /**
     * 从字节数组中的指定点开始，从流中读取指定的字节数。
     * @param buffer 将数据读入的缓冲区。
     * @param index 缓冲区中的起始点，在该处开始读入缓冲区。
     * @param count 要读取的字节数。
     * @returns 读入 buffer 的字节数。 如果可用的字节没有请求的那么多，此数可能小于所请求的字节数；如果到达了流的末尾，此数可能为零。
     */
    read(buffer: Uint8Array, index: number, count: number): number;
    /**
     * 从字符数组中的指定点开始，从流中读取指定的字符数。
     * @param buffer 将数据读入的缓冲区。
     * @param index 缓冲区中的起始点，在该处开始读入缓冲区。
     * @param count 要读取的字符数。
     * @returns 读入缓冲区的总字符数。 如果当前可用的字节没有请求的那么多，此数可能小于所请求的字符数；如果到达了流的末尾，此数可能为零。
     */
    read(buffer: Array<string>, index: number, count: number): number;
    /**
     * 以压缩格式读入 32 位整数。
     * @returns 压缩格式的 32 位整数。
     */
    read7BitEncodedInt(): number;
    /**
     * 从当前流中读取 Boolean 值，并使该流的当前位置提升 1 个字节。
     * @returns 如果字节为非零，则为 true，否则为 false。
     */
    readBoolean(): boolean;
    /**
     * 从当前流中读取下一个字节，并使流的当前位置提升 1 个字节。
     * @returns 从当前流中读取的下一个字节。
     */
    readByte(): number;
    /**
     * 从当前流中读取指定的字节数以写入字节数组中，并将当前位置前移相应的字节数。
     * @param count 要读取的字节数。 此值必须为 0 或非负数字，否则将出现异常。
     * @returns 包含从基础流中读取的数据的字节数组。 如果到达了流的末尾，则该字节数组可能小于所请求的字节数。
     */
    readBytes(count: number): Uint8Array;
    /**
     * 从当前流中读取下一个字符，并根据所使用的 Encoding 和从流中读取的特定字符，提升流的当前位置。
     * @returns 从当前流中读取的字符。
     */
    readChar(): string;
    /**
     * 从当前流中读取指定的字符数，并以字符数组的形式返回数据，然后根据所使用的 Encoding 和从流中读取的特定字符，将当前位置前移。
     * @param count 要读取的字符数。
     * @returns 包含从基础流中读取的数据的字符数组。 如果到达了流的末尾，则该字符数组可能小于所请求的字符数。
     */
    readChars(count: number): Array<string>;
    /**
     * 从当前流中读取具有 15 位整数和 16 位小数的定点数。
     * @returns 从当前流中读取的具有 15 位整数和 16 位小数的定点数。
     */
    readS15Fixed16(): number;
    /**
     * 从当前流中读取具有 16 位整数和 16 位小数的定点数。
     * @returns 从当前流中读取的具有 16 位整数和 16 位小数的定点数。
     */
    readFixed(): number;
    /**
     * 从当前流中读取 8 字节浮点值，并使流的当前位置提升 8 个字节。
     * @returns 从当前流中读取的 8 字节浮点值。
     */
    readDouble(): number;
    /**
     * 从当前流中读取 2 字节有符号整数，并使流的当前位置提升 2 个字节。
     * @returns 从当前流中读取的 2 字节有符号整数。
     */
    readInt16(): number;
    /**
     * 从当前流中读取 4 字节有符号整数，并使流的当前位置提升 4 个字节。
     * @returns 从当前流中读取的 4 字节有符号整数。
     */
    readInt32(): number;
    /**
     * 从当前流中读取 8 字节有符号整数，并使流的当前位置提升 8 个字节。
     * @returns 从当前流中读取的 8 字节有符号整数。
     */
    readInt64(): bigint;
    /**
     * 从此流中读取 1 个有符号字节，并使流的当前位置提升 1 个字节。
     * @returns 从当前流中读取的一个有符号字节。
     */
    readSByte(): number;
    /**
     * 从当前流中读取 4 字节浮点值，并使流的当前位置提升 4 个字节。
     * @returns 从当前流中读取的 4 字节浮点值。
     */
    readSingle(): number;
    /**
     * 从当前流中读取一个字符串。 字符串有长度前缀，一次 7 位地被编码为整数。
     * @returns 正被读取的字符串。
     */
    readString(): string;
    /**
     * 从当前流中读取一个字符串。 无前缀，字符长度根据参数指定。
     * @param count 要读取的字符数。
     * @returns 正被读取的字符串。
     */
    readString(count: number): string;
    /**
     * 从当前流中读取 2 字节无符号整数，并将流的位置提升 2 个字节。
     * @returns 从该流中读取的 2 字节无符号整数。
     */
    readUInt16(): number;
    /**
     * 从当前流中读取 4 字节无符号整数并使流的当前位置提升 4 个字节。
     * @returns 从该流中读取的 4 字节无符号整数。
     */
    readUInt32(): number;
    /**
     * 从当前流中读取 8 字节无符号整数并使流的当前位置提升 8 个字节。
     * @returns 从该流中读取的 8 字节无符号整数。
     */
    readUInt64(): bigint;
    /**
     * 读取指针区域。
     * @param moveTo 指针地址。
     * @param action 回调函数。
     * @returns 回调函数的返回值。
     */
    pointer(moveTo: number, action: Function): Promise<any>;
}
export {};
//# sourceMappingURL=binary-reader.d.ts.map