import SeekOrigin from "./seekOrigin";

/**
 * 提供字节序列的一般视图。 这是一个抽象类。
 * @class
 */
export default class Stream {
  /**
   * 无后备存储区的 Stream。
   */
  static readonly null: NullStream;

  /**
   * 当在派生类中重写时，获取指示当前流是否支持超时。
   * @returns {Boolean} 如果流支持超时，为 true；否则为 false。
   */
  get canTimeout(): Boolean;

  /**
   * 当在派生类中重写时，获取指示当前流是否支持读取的值。
   * @returns {Boolean} 如果流支持读取，为 true；否则为 false。
   */
  get canRead(): Boolean;

  /**
   * 当在派生类中重写时，获取指示当前流是否支持查找功能的值。
   * @returns {Boolean} 如果流支持查找，为 true；否则为 false。
   */
  get canSeek(): Boolean;

  /**
   * 当在派生类中重写时，获取指示当前流是否支持写入功能的值。
   * @returns {Boolean} 如果流支持写入，则为 true；否则为 false。
   */
  get canWrite(): Boolean;

  /**
   * 当在派生类中重写时，获取流长度（以字节为单位）。
   * @returns {Number} 表示流长度（以字节为单位）的长值。
   */
  get length(): Number;

  /**
   * 当在派生类中重写时，获取当前流中的位置。
   * @returns {Number} 流中的当前位置。
   */
  get position(): Number;

  /**
   * 当在派生类中重写时，设置当前流中的位置。
   * @param {Number} value 当前流中的位置。
   */
  set position(value: Number);

  /**
   * 初始化 Stream 类的新实例。
   * @returns {Stream} Stream 类的新实例。
   */
  constructor();

  /**
   * 从当前流中读取字节并将其写入到另一流中。
   * @param {Stream} destination 当前流的内容将复制到的流。
   * @returns {void}
   */
  copyTo(destination: Stream): void;

  /**
   * 使用指定的缓冲区大小，从当前流中读取字节并将其写入到另一流中。
   * @param {Stream} destination 当前流的内容将复制到的流。
   * @param {Number} bufferSize 缓冲区的大小。 此值必须大于零。 默认大小为 81920。
   * @returns {void}
   */
  copyTo(destination: Stream, bufferSize: Number): void;

  /**
   * 关闭当前流并释放与之关联的所有资源（如套接字和文件句柄）。 不直接调用此方法，而应确保流得以正确释放。
   * @returns {void}
   */
  close(): void;

  /**
   * 当在派生类中重写时，将清除该流的所有缓冲区，并使得所有缓冲数据被写入到基础设备。
   * @returns {void}
   */
  flush(): void;

  /**
   * 当在派生类中重写时，设置当前流中的位置。
   * @param {Number} offset 相对于 origin 参数的字节偏移量。
   * @param {SeekOrigin} origin SeekOrigin 类型的值，指示用于获取新位置的参考点。
   * @returns {Number} 当前流中的新位置。
   */
  seek(offset: Number, origin: SeekOrigin): Number;

  /**
   * 当在派生类中重写时，设置当前流的长度。
   * @param {Number} value 所需的当前流的长度（以字节表示）。
   * @returns {void}
   */
  setLength(value: Number): void;

  /**
   * 当在派生类中重写时，从当前流读取字节序列，并将此流中的位置提升读取的字节数。
   * @param {Uint8Array} buffer 字节数组。 此方法返回时，该缓冲区包含指定的字符数组，该数组的 offset 和 (offset + count -1) 之间的值由从当前源中读取的字节替换。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始存储从当前流中读取的数据。
   * @param {Number} count 要从当前流中最多读取的字节数。
   * @returns {Number} 读入缓冲区中的总字节数。 如果很多字节当前不可用，则总字节数可能小于请求的字节数；如果已到达流结尾，则为零 (0)。
   */
  read(buffer: Uint8Array, offset: Number, count: Number): Number;

  /**
   * 从流中读取一个字节，并将流内的位置向前提升一个字节，或者如果已到达流结尾，则返回 -1。
   * @returns {Number} 强制转换为 Int32 的无符号字节，如果到达流的末尾，则为 -1。
   */
  readByte(): Number;

  /**
   * 当在派生类中重写时，向当前流中写入字节序列，并将此流中的当前位置提升写入的字节数。
   * @param {Uint8Array} buffer 字节数组。 此方法将 count 个字节从 buffer 复制到当前流。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
   * @param {Number} count 要写入当前流的字节数。
   * @returns {void}
   */
  write(buffer: Uint8Array, offset: Number, count: Number): void;

  /**
   * 将一个字节写入流内的当前位置，并将流内的位置向前提升一个字节。
   * @param {Number} value 要写入流中的字节。
   * @returns {void}
   */
  writeByte(value: Number): void;
}

declare class NullStream extends Stream {
  /**
   * 获取指示当前流是否支持读取的值。
   * @returns {Boolean} 如果流支持读取，为 true；否则为 false。
   */
  get canRead(): Boolean;

  /**
   * 获取指示当前流是否支持查找功能的值。
   * @returns {Boolean} 如果流支持查找，为 true；否则为 false。
   */
  get canSeek(): Boolean;

  /**
   * 获取指示当前流是否支持写入功能的值。
   * @returns {Boolean} 如果流支持写入，则为 true；否则为 false。
   */
  get canWrite(): Boolean;

  /**
   * 获取流长度（以字节为单位）。
   * @returns {Number} 表示流长度（以字节为单位）的长值。
   */
  get length(): Number;

  /**
   * 获取当前流中的位置。
   * @returns {Number} 流中的当前位置。
   */
  get position(): Number;

  /**
   * 设置当前流中的位置。
   * @param {Number} value 当前流中的位置。
   */
  set position(value: Number);

  /**
   * 将清除该流的所有缓冲区，并使得所有缓冲数据被写入到基础设备。
   * @returns {void}
   */
  flush(): void;

  /**
   * 设置当前流中的位置。
   * @param {Number} offset 相对于 origin 参数的字节偏移量。
   * @param {SeekOrigin} origin SeekOrigin 类型的值，指示用于获取新位置的参考点。
   * @returns {Number} 当前流中的新位置。
   */
  seek(offset: Number, origin: SeekOrigin): Number;

  /**
   * 设置当前流的长度。
   * @param {Number} value 所需的当前流的长度（以字节表示）。
   * @returns {void}
   */
  setLength(value: Number): void;

  /**
   * 从当前流读取字节序列，并将此流中的位置提升读取的字节数。
   * @param {Uint8Array} buffer 字节数组。 此方法返回时，该缓冲区包含指定的字符数组，该数组的 offset 和 (offset + count -1) 之间的值由从当前源中读取的字节替换。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始存储从当前流中读取的数据。
   * @param {Number} count 要从当前流中最多读取的字节数。
   * @returns {Number} 读入缓冲区中的总字节数。 如果很多字节当前不可用，则总字节数可能小于请求的字节数；如果已到达流结尾，则为零 (0)。
   */
  read(buffer: Uint8Array, offset: Number, count: Number): Number;

  /**
   * 从流中读取一个字节，并将流内的位置向前提升一个字节，或者如果已到达流结尾，则返回 -1。
   * @returns {Number} 强制转换为 Int32 的无符号字节，如果到达流的末尾，则为 -1。
   */
  readByte(): Number;

  /**
   * 向当前流中写入字节序列，并将此流中的当前位置提升写入的字节数。
   * @param {Uint8Array} buffer 字节数组。 此方法将 count 个字节从 buffer 复制到当前流。
   * @param {Number} offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
   * @param {Number} count 要写入当前流的字节数。
   * @returns {void}
   */
  write(buffer: Uint8Array, offset: Number, count: Number): void;

  /**
   * 将一个字节写入流内的当前位置，并将流内的位置向前提升一个字节。
   * @param {Number} value 要写入流中的字节。
   * @returns {void}
   */
  writeByte(value: Number): void;
}
