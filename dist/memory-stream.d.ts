import SeekOrigin from "./seek-origin";
import Stream from "./stream";
declare const CONSTRUCTOR_SYMBOL: unique symbol;
export default class MemoryStream extends Stream {
    #private;
    /**
     * 获取一个值，该值指示当前流是否支持读取。
     * @returns 如果流是打开的，则为 true。
     */
    get canRead(): boolean;
    /**
     * 获取一个值，该值指示当前流是否支持查找。
     * @returns 如果流是打开的，则为 true。
     */
    get canSeek(): boolean;
    /**
     * 获取一个值，该值指示当前流是否支持写入。
     * @returns 如果流支持写入，则为 true；否则为 false。
     */
    get canWrite(): boolean;
    /**
     * 获取流的长度（以字节为单位）。
     * @returns 流的长度（以字节为单位）。
     */
    get length(): number;
    /**
     * 获取分配给该流的字节数。
     * @returns 流的缓冲区的可使用部分的长度。
     */
    get capacity(): number;
    /**
     * 设置分配给该流的字节数。
     * @param value 分配给该流的字节数。
     */
    set capacity(value: number);
    /**
     * 获取流中的当前位置。
     * @returns 流中的当前位置。
     */
    get position(): number;
    /**
     * 设置流中的当前位置。
     * @param value 流中的当前位置。
     */
    set position(value: number);
    /**
     * 使用初始化为零的可扩展容量初始化 MemoryStream 类的新实例。
     */
    constructor();
    /**
     * 使用按指定要求初始化的可扩展容量初始化 MemoryStream 类的新实例。
     * @param capacity 内部数组的初始大小（以字节为单位）。
     */
    constructor(capacity: number);
    /**
     * 基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建当前流的无符号字节数组。
     */
    constructor(buffer: Uint8Array);
    /**
     * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     */
    constructor(buffer: Uint8Array, writable: boolean);
    /**
     * 基于字节数组的指定区域（索引）初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     */
    constructor(buffer: Uint8Array, index: number, count: number);
    /**
     * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于字节数组的指定区域，初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     */
    constructor(buffer: Uint8Array, index: number, count: number, writable: boolean);
    /**
     * 在 MemoryStream.CanWrite 属性和调用 MemoryStream.GetBuffer 的能力按指定设置的状态下，基于字节数组的指定区域初始化 MemoryStream 类的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     * @param publiclyVisible 设置为 true 可以启用 MemoryStream.GetBuffer，它返回无符号字节数组，流从该数组创建；否则为 false。
     */
    constructor(buffer: Uint8Array, index: number, count: number, writable: boolean, publiclyVisible: boolean);
    private static [CONSTRUCTOR_SYMBOL];
    /**
     * 关闭 MemoryStream 流。
     */
    close(): void;
    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     */
    flush(): void;
    /**
     * 返回从中创建此流的无符号字节的数组。
     * @returns 创建此流所用的字节数组；或者如果在当前实例的构造期间没有向 MemoryStream 构造函数提供字节数组，则为基础数组。
     */
    getBuffer(): Uint8Array;
    /**
     * 从当前流中读取字节块并将数据写入缓冲区。
     * @param buffer 当此方法返回时，包含指定的字节数组，该数组中从 offset 到 (offset + count -1) 之间的值由从当前流中读取的字符替换。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始存储当前流中的数据。
     * @param count 最多读取的字节数。
     * @returns 写入缓冲区中的总字节数。 如果字节数当前不可用，则总字节数可能小于所请求的字节数；如果在读取到任何字节前已到达流结尾，则为零。
     */
    read(buffer: Uint8Array, offset: number, count: number): number;
    /**
     * 从当前流中读取一个字节。
     * @returns 强制转换为 Int32 的字节；或者如果已到达流的末尾，则为 -1。
     */
    readByte(): number;
    /**
     * 将当前流中的位置设置为指定值。
     * @param offset 流内的新位置。 它是相对于 loc 参数的位置，而且可正可负。
     * @param loc 类型 SeekOrigin 的值，它用作查找引用点。
     * @returns 流内的新位置，通过将初始引用点和偏移量合并计算而得。
     */
    seek(offset: number, loc: SeekOrigin): number;
    /**
     * 将当前流的长度设为指定值。
     * @param {Number} value 用于设置长度的值。
     * @returns {void}
     */
    setLength(value: number): void;
    /**
     * 将流内容写入字节数组，而与 MemoryStream.position 属性无关。
     * @returns 新的字节数组。
     */
    toArray(): number[];
    /**
     * 使用从缓冲区读取的数据将字节块写入当前流。
     * @param buffer 从中写入数据的缓冲区。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
     * @param count 最多写入的字节数。
     */
    write(buffer: Uint8Array, offset: number, count: number): void;
    /**
     * 将一个字节写入当前位置上的当前流。
     * @param {Number} value 要写入的字节。
     * @returns {void}
     */
    writeByte(value: number): void;
    /**
     * 将此内存流的整个内容写入到另一个流中。
     * @param {Stream} stream 要写入此内存流的流。
     * @returns {void}
     */
    writeTo(stream: Stream): void;
}
export {};
//# sourceMappingURL=memory-stream.d.ts.map