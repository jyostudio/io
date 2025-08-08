import Stream from "./stream";
import SeekOrigin from "./seekOrigin";

/**
 * 创建一个流，其后备存储为内存。
 * @class
 */
export default class MemoryStream extends Stream {
  /**
   * 获取一个值，该值指示当前流是否支持读取。
   * @returns {Boolean} 如果流是打开的，则为 true。
   */
  get canRead(): Boolean;

  /**
   * 获取一个值，该值指示当前流是否支持查找。
   * @returns {Boolean} 如果流是打开的，则为 true。
   */
  get canSeek(): Boolean;

  /**
   * 获取一个值，该值指示当前流是否支持写入。
   * @returns {Boolean} 如果流支持写入，则为 true；否则为 false。
   */
  get canWrite(): Boolean;

  /**
   * 获取流的长度（以字节为单位）。
   * @returns {Number} 流的长度（以字节为单位）。
   */
  get length(): Number;

  /**
   * 获取分配给该流的字节数。
   * @returns {Number} 流的缓冲区的可使用部分的长度。
   */
  get capacity(): Number;

  /**
   * 设置分配给该流的字节数。
   * @param {Number} value 分配给该流的字节数。
   */
  set capacity(value: Number);

  /**
   * 获取流中的当前位置。
   * @returns {Number} 流中的当前位置。
   */
  get position(): Number;

  /**
   * 设置流中的当前位置。
   * @param {Number} value 流中的当前位置。
   */
  set position(value: Number);

  /**
   * 使用初始化为零的可扩展容量初始化 MemoryStream 类的新实例。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor();

  /**
   * 使用按指定要求初始化的可扩展容量初始化 MemoryStream 类的新实例。
   * @param {Number} capacity 内部数组的初始大小（以字节为单位）。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(capacity: Number);

  /**
   * 基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
   * @param {Uint8Array} buffer 从中创建当前流的无符号字节数组。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(buffer: Uint8Array);

  /**
   * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
   * @param {MemoryStream} buffer 从中创建此流的无符号字节的数组。
   * @param {Boolean} writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(buffer: Uint8Array, writable: Boolean);

  /**
   * 基于字节数组的指定区域（索引）初始化 MemoryStream 类的无法调整大小的新实例。
   * @param {Uint8Array} buffer 从中创建此流的无符号字节的数组。
   * @param {Number} index buffer 内的索引，流从此处开始。
   * @param {Number} count 流的长度（以字节为单位）。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(buffer: Uint8Array, index: Number, count: Number);

  /**
   * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于字节数组的指定区域，初始化 MemoryStream 类的无法调整大小的新实例。
   * @param {Uint8Array} buffer 从中创建此流的无符号字节的数组。
   * @param {Number} index buffer 内的索引，流从此处开始。
   * @param {Number} count 流的长度（以字节为单位）。
   * @param {Boolean} writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(
    buffer: Uint8Array,
    index: Number,
    count: Number,
    writable: Boolean
  );

  /**
   * 在 MemoryStream.CanWrite 属性和调用 MemoryStream.GetBuffer 的能力按指定设置的状态下，基于字节数组的指定区域初始化 MemoryStream 类的新实例。
   * @param {Uint8Array} buffer 从中创建此流的无符号字节的数组。
   * @param {Number} index buffer 内的索引，流从此处开始。
   * @param {Number} count 流的长度（以字节为单位）。
   * @param {Boolean} writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
   * @param {Boolean} publiclyVisible 设置为 true 可以启用 MemoryStream.GetBuffer，它返回无符号字节数组，流从该数组创建；否则为 false。
   * @returns {MemoryStream} MemoryStream 类的新实例。
   */
  constructor(
    buffer: Uint8Array,
    index: Number,
    count: Number,
    writable: Boolean,
    publiclyVisible: Boolean
  );

  /**
   * 关闭 MemoryStream 流。
   * @returns {void}
   */
  close(): void;

  /**
   * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
   * @returns {void}
   */
  flush(): void;

  /**
   * 返回从中创建此流的无符号字节的数组。
   * @returns {Uint8Array} 创建此流所用的字节数组；或者如果在当前实例的构造期间没有向 MemoryStream 构造函数提供字节数组，则为基础数组。
   */
  getBuffer(): Uint8Array;

  /**
   * 从当前流中读取字节块并将数据写入缓冲区。
   * @param {Uint8Array} buffer 当此方法返回时，包含指定的字节数组，该数组中从 offset 到 (offset + count -1) 之间的值由从当前流中读取的字符替换。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始存储当前流中的数据。
   * @param {Number} count 最多读取的字节数。
   * @returns {Number} 写入缓冲区中的总字节数。 如果字节数当前不可用，则总字节数可能小于所请求的字节数；如果在读取到任何字节前已到达流结尾，则为零。
   */
  read(buffer: Uint8Array, offset: Number, count: Number): Number;

  /**
   * 从当前流中读取一个字节。
   * @returns {Number} 强制转换为 Int32 的字节；或者如果已到达流的末尾，则为 -1。
   */
  readByte(): Number;

  /**
   * 将当前流中的位置设置为指定值。
   * @param {Number} offset 流内的新位置。 它是相对于 loc 参数的位置，而且可正可负。
   * @param {SeekOrigin} loc 类型 SeekOrigin 的值，它用作查找引用点。
   * @returns {Number} 流内的新位置，通过将初始引用点和偏移量合并计算而得。
   */
  seek(offset: Number, loc: SeekOrigin): Number;

  /**
   * 将当前流的长度设为指定值。
   * @param {Number} value 用于设置长度的值。
   * @returns {void}
   */
  setLength(value: Number): void;

  /**
   * 将流内容写入字节数组，而与 MemoryStream.position 属性无关。
   * @returns {Array<Number>} 新的字节数组。
   */
  toArray(): Array<Number>;

  /**
   * 使用从缓冲区读取的数据将字节块写入当前流。
   * @param {Uint8Array} buffer 从中写入数据的缓冲区。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
   * @param {Number} count 最多写入的字节数。
   * @returns {void}
   */
  write(buffer: Uint8Array, offset: Number, count: Number): void;

  /**
   * 将一个字节写入当前位置上的当前流。
   * @param {Number} value 要写入的字节。
   * @returns {void}
   */
  writeByte(value: Number): void;

  /**
   * 将此内存流的整个内容写入到另一个流中。
   * @param {Stream} stream 要写入此内存流的流。
   * @returns {void}
   */
  writeTo(stream: Stream): void;
}
