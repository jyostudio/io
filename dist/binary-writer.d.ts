import List from "@jyostudio/list";
import { Encoding } from "@jyostudio/text";
import SeekOrigin from "./seek-origin";
import Stream from "./stream";
declare const CONSTRUCTOR_SYMBOL: unique symbol;
/**
 * 将二进制中的基元类型写入流并支持用特定的编码写入字符串。
 */
export default class BinaryWriter {
    #private;
    /**
     * 指定无后备存储的 BinaryWriter。
     * @returns 无后备存储的 BinaryWriter。
     */
    static get null(): BinaryWriter;
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
     * 获取 BinaryWriter 的基础流。
     * @returns 与 BinaryWriter 关联的基础流。
     */
    get baseStream(): Stream | null;
    /**
     * 基于所指定的流和特定的 UTF-8 编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     */
    constructor(output: Stream);
    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     * @param encoding 要使用的字符编码。
     */
    constructor(output: Stream, encoding: Encoding);
    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     * @param encoding 要使用的字符编码。
     * @param bigEndian 是否使用大端字节序。
     */
    constructor(output: Stream, encoding: Encoding, bigEndian: boolean);
    private static [CONSTRUCTOR_SYMBOL];
    /**
     * 关闭当前的 BinaryWriter 和基础流。
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
     * 设置当前流中的位置。
     * @param offset 相对于 origin 的字节偏移量。
     * @param origin SeekOrigin 的一个字段，指示获取新位置所依据的参考点。
     * @returns 包含当前流的位置。
     */
    seek(offset: number, origin: SeekOrigin): number;
    /**
     * 将单字节 Boolean 值写入当前流，其中 0 表示 false，1 表示 true。
     * @param value 要写入的 Boolean 值。
     */
    writeBoolean(value: boolean): void;
    /**
     * 将一个无符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param value 要写入的无符号字节。
     */
    writeByte(value: number): void;
    /**
     * 将字节数组写入基础流。
     * @param buffer 包含要写入的数据的字节数组。
     */
    writeBytes(buffer: Uint8Array): void;
    /**
     * 将字节数组区域写入当前流。
     * @param buffer 包含要写入的数据的字节数组。
     * @param index 要从 buffer 中读取且要写入流的第一个字节的索引。
     * @param count 要从 buffer 中读取且要写入流的字节数。
     */
    writeBytes(buffer: Uint8Array, index: number, count: number): void;
    /**
     * 将 Unicode 字符写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param ch 要写入的非代理项 Unicode 字符。
     */
    writeChar(ch: string): void;
    /**
     * 将字符数组写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param chars 包含要写入的数据的字符数组。
     */
    writeChars(chars: List<string>): void;
    /**
     * 将字符数组部分写入当前流，并根据所使用的 Encoding（可能还根据向流中写入的特定字符），提升流的当前位置。
     * @param chars 包含要写入的数据的字符数组。
     * @param index 要从 chars 中读取且要写入流的第一个字符的索引。
     * @param count 要从 chars 中读取且要写入流的字符数。
     */
    writeChars(chars: List<string>, index: number, count: number): void;
    /**
     * 将 8 字节浮点值写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节浮点值。
     */
    writeDouble(value: number): void;
    /**
     * 将 4 字节浮点值写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节浮点值。
     */
    writeSingle(value: number): void;
    /**
     * 将有长度前缀的字符串按 BinaryWriter 的当前编码写入此流，并根据所使用的编码和写入流的特定字符，提升流的当前位置。
     * @param value 要写入的值。
     */
    writeString(value: string): void;
    /**
     * 将 2 字节带符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param value 要写入的 2 字节带符号整数。
     */
    writeInt16(value: number): void;
    /**
     * 将 4 字节带符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节带符号整数。
     */
    writeInt32(value: number): void;
    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节带符号整数。
     */
    writeInt64(value: number): void;
    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节带符号整数。
     */
    writeInt64(value: bigint): void;
    /**
     * 将一个带符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param value 要写入的带符号字节。
     * @throws {RangeError} 如果值不在 -128 到 127 之间。
     */
    writeSByte(value: number): void;
    /**
     * 将 2 字节无符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param value 要写入的 2 字节无符号整数。
     */
    writeUInt16(value: number): void;
    /**
     * 将 4 字节无符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节无符号整数。
     */
    writeUInt32(value: number): void;
    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节无符号整数。
     */
    writeUInt64(value: number): void;
    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节无符号整数。
     */
    writeUInt64(value: bigint): void;
    /**
     * 以压缩格式写入 32 位整数。
     * @param value 要写入的 32 位整数。
     */
    write7BitEncodedInt(value: number): void;
}
export {};
//# sourceMappingURL=binary-writer.d.ts.map