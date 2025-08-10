import overload from "@jyostudio/overload";
import { checkSetterType } from "@jyostudio/overload/dist/decorator.js";
import _Buffer from "./_buffer";
import SeekOrigin from "./seek-origin";
import Stream from "./stream";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 创建一个流，其后备存储为内存。
 */
export default class MemoryStream extends Stream {
    /**
     * 表示内存流的最大长度（以字节为单位）。
     */
    static #MEM_STREAM_MAX_LENGTH = Number.MAX_SAFE_INTEGER;

    /**
     * 表示内存流的最大字节数组长度（以字节为单位）。
     */
    static #MAX_BYTE_ARRAY_LENGTH = 0x7FFFFFC7;

    /**
     * 表示内存流的字节缓冲区。
     */
    #buffer: Uint8Array | null = null;

    /**
     * 表示内存流的当前位置（以字节为单位）。
     */
    #position = 0;

    /**
     * 表示内存流的长度（以字节为单位）。
     */
    #length = 0;

    /**
     * 表示内存流的容量（以字节为单位）。
     */
    #capacity = 0;

    /**
     * 表示内存流是否可写。
     */
    #writable = false;

    /**
     * 表示内存流是否可扩展。
     */
    #expandable = false;

    /**
     * 表示内存流是否可公开访问。
     */
    #exposable = false;

    /**
     * 表示内存流的起始偏移量（以字节为单位）。
     */
    #origin = 0;

    /**
     * 表示内存流是否已打开。
     */
    #isOpen = false;

    /**
     * 获取一个值，该值指示当前流是否支持读取。
     * @returns 如果流是打开的，则为 true。
     */
    public get canRead() {
        return this.#isOpen;
    }

    /**
     * 获取一个值，该值指示当前流是否支持查找。
     * @returns 如果流是打开的，则为 true。
     */
    public get canSeek() {
        return this.#isOpen;
    }

    /**
     * 获取一个值，该值指示当前流是否支持写入。
     * @returns 如果流支持写入，则为 true；否则为 false。
     */
    public get canWrite() {
        return this.#isOpen && this.#writable;
    }

    /**
     * 获取流的长度（以字节为单位）。
     * @returns 流的长度（以字节为单位）。
     */
    public get length() {
        this.#checkOpen();

        return this.#length - this.#origin;
    }

    /**
     * 获取分配给该流的字节数。
     * @returns 流的缓冲区的可使用部分的长度。
     */
    public get capacity() {
        this.#checkOpen();

        return this.#capacity - this.#origin;
    }

    /**
     * 设置分配给该流的字节数。
     * @param value 分配给该流的字节数。
     */
    @checkSetterType(Number)
    public set capacity(value: number) {
        this.#checkOpen();

        value = value | 0;

        if (value < 0) {
            throw new RangeError("容量不能小于 0。");
        }

        if (value > MemoryStream.#MAX_BYTE_ARRAY_LENGTH) {
            throw new RangeError("容量超出允许范围。");
        }

        let expandable = this.#expandable;
        if (!expandable && value !== this.capacity) {
            throw new Error("无法设置非可扩展 MemoryStream 的容量。");
        }

        if (expandable && value !== this.capacity) {
            if (value > 0) {
                let newBuffer = new Uint8Array(value);
                if (this.#length > 0) {
                    _Buffer.blockCopy(this.#buffer as Uint8Array, 0, newBuffer, 0, this.#length);
                }

                this.#buffer = newBuffer;
            } else {
                this.#buffer = null;
            }
            this.#capacity = value;
        }
    }

    /**
     * 获取流中的当前位置。
     * @returns 流中的当前位置。
     */
    public get position() {
        this.#checkOpen();

        return this.#position - this.#origin;
    }

    /**
     * 设置流中的当前位置。
     * @param value 流中的当前位置。
     */
    @checkSetterType(Number)
    public set position(value: number) {
        this.#checkOpen();

        value = value | 0;

        if (value < 0) {
            throw new RangeError("位置不能小于 0。");
        }

        if (value > MemoryStream.#MEM_STREAM_MAX_LENGTH) {
            throw new RangeError("位置超出范围。");
        }

        this.#position = this.#origin + value;
    }

    /**
     * 使用初始化为零的可扩展容量初始化 MemoryStream 类的新实例。
     */
    public constructor();

    /**
     * 使用按指定要求初始化的可扩展容量初始化 MemoryStream 类的新实例。
     * @param capacity 内部数组的初始大小（以字节为单位）。
     */
    public constructor(capacity: number);

    /**
     * 基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建当前流的无符号字节数组。
     */
    public constructor(buffer: Uint8Array);

    /**
     * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于指定的字节数组初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     */
    public constructor(buffer: Uint8Array, writable: boolean);

    /**
     * 基于字节数组的指定区域（索引）初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     */
    public constructor(buffer: Uint8Array, index: number, count: number);

    /**
     * 在 MemoryStream.CanWrite 属性按指定设置的状态下，基于字节数组的指定区域，初始化 MemoryStream 类的无法调整大小的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     */
    public constructor(
        buffer: Uint8Array,
        index: number,
        count: number,
        writable: boolean
    );

    /**
     * 在 MemoryStream.CanWrite 属性和调用 MemoryStream.GetBuffer 的能力按指定设置的状态下，基于字节数组的指定区域初始化 MemoryStream 类的新实例。
     * @param buffer 从中创建此流的无符号字节的数组。
     * @param index buffer 内的索引，流从此处开始。
     * @param count 流的长度（以字节为单位）。
     * @param writable MemoryStream.CanWrite 属性的设置，确定该流是否支持写入。
     * @param publiclyVisible 设置为 true 可以启用 MemoryStream.GetBuffer，它返回无符号字节数组，流从该数组创建；否则为 false。
     */
    public constructor(
        buffer: Uint8Array,
        index: number,
        count: number,
        writable: boolean,
        publiclyVisible: boolean
    );

    public constructor(...params: any) {
        super();

        return MemoryStream[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): MemoryStream {
        MemoryStream[CONSTRUCTOR_SYMBOL] = overload()
            .add([], function (this: MemoryStream) {
                return MemoryStream[CONSTRUCTOR_SYMBOL].call(this, 0);
            })
            .add([Number], function (this: MemoryStream, capacity: number) {
                if (capacity < 0) {
                    throw new Error("容量不能小于 0。");
                }

                this.#buffer = new Uint8Array(capacity);
                this.#capacity = capacity;
                this.#writable = true;
                this.#exposable = true;
                this.#expandable = true;
                this.#origin = 0;
                this.#isOpen = true;
            })
            .add([Uint8Array], function (this: MemoryStream, buffer: Uint8Array) {
                return MemoryStream[CONSTRUCTOR_SYMBOL].call(this, buffer, true);
            })
            .add([Uint8Array, Boolean], function (this: MemoryStream, buffer: Uint8Array, writable: boolean) {
                this.#buffer = buffer;
                this.#length = this.#capacity = buffer.length;
                this.#writable = writable;
                this.#exposable = false;
                this.#expandable = false;
                this.#origin = 0;
                this.#isOpen = true;
            })
            .add([Uint8Array, Number, Number], function (this: MemoryStream, buffer: Uint8Array, index: number, count: number) {
                return MemoryStream[CONSTRUCTOR_SYMBOL].call(this, buffer, index, count, true, false);
            })
            .add([Uint8Array, Number, Number, Boolean], function (this: MemoryStream, buffer: Uint8Array, index: number, count: number, writable: boolean) {
                return MemoryStream[CONSTRUCTOR_SYMBOL].call(this, buffer, index, count, writable, false);
            })
            .add([Uint8Array, Number, Number, Boolean, Boolean], function (this: MemoryStream, buffer: Uint8Array, index: number, count: number, writable: boolean, publiclyVisible: boolean) {
                if (index < 0) {
                    throw new RangeError("“index”不能小于 0。");
                }

                if (count < 0) {
                    throw new RangeError("“count”不能小于 0。");
                }

                if (buffer.length - index < count) {
                    throw new RangeError("“index”和“count”的总和大于缓冲区长度。");
                }

                this.#buffer = buffer;
                this.#origin = this.#position = index;
                this.#length = this.#capacity = index + count;
                this.#writable = writable;
                this.#exposable = publiclyVisible;
                this.#expandable = false;
                this.#isOpen = true;
            });

        return MemoryStream[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 检查流是否已打开。
     * @throws {Error} 如果流已关闭。
     * @private
     */
    #checkOpen() {
        if (!this.#isOpen) {
            throw new Error("流已关闭。");
        }
    }

    /**
     * 确保容量足够大以容纳指定的值。
     * @param value 需要的容量。
     * @returns 如果容量已更改，则为 true；否则为 false。
     * @throws {RangeError} 如果 value 小于零。
     * @private
     */
    #ensureCapacity(value: number): boolean {
        value = value | 0;

        if (value < 0) {
            throw new RangeError("“value”不能小于 0。");
        }

        const capacity = this.#capacity;
        if (value > capacity) {
            let newCapacity = Math.max(Math.max(value, 256), capacity * 2);

            const maxByteArrayLength = MemoryStream.#MAX_BYTE_ARRAY_LENGTH;
            if (capacity * 2 > maxByteArrayLength) {
                newCapacity = Math.max(value, maxByteArrayLength);
            }

            this.capacity = newCapacity;

            return true;
        }

        return false;
    }

    /**
     * 释放与当前 MemoryStream 对象关联的所有资源。
     */
    public override[Symbol.dispose]() {
        this.#buffer = null;
        this.#capacity = 0;
        this.#exposable = false;
        this.#length = 0;
        this.#origin = 0;
        this.#position = 0;
        this.#isOpen = false;
        this.#writable = false;
        this.#expandable = false;

        super[Symbol.dispose]();
    }

    /**
     * 关闭 MemoryStream 流。
     */
    public override close(): void;

    public override close(...params: any): any {
        MemoryStream.prototype.close = overload([], function (this: MemoryStream): void {
            this[Symbol.dispose]();
        });

        return MemoryStream.prototype.close.apply(this, params);
    }

    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     */
    public override flush(): void;

    public override flush(...params: any): any {
        MemoryStream.prototype.flush = overload([], function (this: MemoryStream): void {
            this.#checkOpen();
        });

        return MemoryStream.prototype.flush.apply(this, params);
    }

    /**
     * 返回从中创建此流的无符号字节的数组。
     * @returns 创建此流所用的字节数组；或者如果在当前实例的构造期间没有向 MemoryStream 构造函数提供字节数组，则为基础数组。
     */
    public getBuffer(): Uint8Array;

    public getBuffer(...params: any): any {
        MemoryStream.prototype.getBuffer = overload([], function (this: MemoryStream): Uint8Array {
            this.#checkOpen();

            if (!this.#exposable) {
                throw new Error("MemoryStream 未使用可访问的缓冲区创建。");
            }

            return (this.#buffer as Uint8Array);
        });

        return MemoryStream.prototype.getBuffer.apply(this, params);
    }

    /**
     * 从当前流中读取字节块并将数据写入缓冲区。
     * @param buffer 当此方法返回时，包含指定的字节数组，该数组中从 offset 到 (offset + count -1) 之间的值由从当前流中读取的字符替换。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始存储当前流中的数据。
     * @param count 最多读取的字节数。
     * @returns 写入缓冲区中的总字节数。 如果字节数当前不可用，则总字节数可能小于所请求的字节数；如果在读取到任何字节前已到达流结尾，则为零。
     */
    public override read(buffer: Uint8Array, offset: number, count: number): number;

    public override read(...params: any): any {
        MemoryStream.prototype.read = overload([Uint8Array, Number, Number], function (this: MemoryStream, buffer: Uint8Array, offset: number, count: number): number {
            this.#checkOpen();

            if (offset < 0) {
                throw new RangeError("“offset”不能小于 0。");
            }

            if (count < 0) {
                throw new RangeError("“count”不能小于 0。");
            }

            if (buffer.length - offset < count) {
                throw new RangeError("“offset”和“count”的总和大于缓冲区长度。");
            }

            let n = this.#length - this.#position;

            if (n > count) {
                n = count;
            }

            if (n <= 0) {
                return 0;
            }

            if (n <= 8) {
                let byteCount = n;
                while (--byteCount >= 0) {
                    buffer[offset + byteCount] = (this.#buffer as Uint8Array)[this.#position + byteCount];
                }
            } else {
                _Buffer.blockCopy(this.#buffer as Uint8Array, this.#position, buffer, offset, n);
            }

            this.#position += n;

            return n;
        });

        return MemoryStream.prototype.read.apply(this, params);
    }

    /**
     * 从当前流中读取一个字节。
     * @returns 强制转换为 Int32 的字节；或者如果已到达流的末尾，则为 -1。
     */
    public override readByte(): number;

    public override readByte(...params: any): any {
        MemoryStream.prototype.readByte = overload([], function (this: MemoryStream): number {
            this.#checkOpen();

            if (this.#position >= this.#length) return -1;

            return (this.#buffer as Uint8Array)[this.#position++];
        });

        return MemoryStream.prototype.readByte.apply(this, params);
    }

    /**
     * 将当前流中的位置设置为指定值。
     * @param offset 流内的新位置。 它是相对于 loc 参数的位置，而且可正可负。
     * @param loc 类型 SeekOrigin 的值，它用作查找引用点。
     * @returns 流内的新位置，通过将初始引用点和偏移量合并计算而得。
     */
    public override seek(offset: number, loc: SeekOrigin): number;

    public override seek(...params: any): any {
        MemoryStream.prototype.seek = overload([Number, SeekOrigin], function (this: MemoryStream, offset: number, loc: SeekOrigin): number {
            this.#checkOpen();

            if (offset > MemoryStream.#MEM_STREAM_MAX_LENGTH) {
                throw new RangeError("“offset”必须小于 2^31 - 1。");
            }

            const origin = this.#origin;
            let tempPosition;
            switch (loc) {
                case SeekOrigin.begin:
                    tempPosition = origin + (offset | 0);
                    if (offset < 0 || tempPosition < origin) {
                        throw new RangeError("查找超出起始位置。");
                    }
                    this.#position = tempPosition;
                    break;
                case SeekOrigin.current:
                    const position = this.#position;
                    tempPosition = position + (offset | 0);
                    if (position + offset < origin || tempPosition < origin) {
                        throw new RangeError("查找超出起始位置。");
                    }
                    this.#position = tempPosition;
                    break;
                case SeekOrigin.end:
                    const length = this.#length;
                    tempPosition = length + (offset | 0);
                    if (length + offset < origin || tempPosition < origin) {
                        throw new RangeError("查找超出起始位置。");
                    }
                    this.#position = tempPosition;
                    break;
                default:
                    throw new SyntaxError("无效的查找起始位置。");
            }

            return this.#position;
        });

        return MemoryStream.prototype.seek.apply(this, params);
    }

    /**
     * 将当前流的长度设为指定值。
     * @param {Number} value 用于设置长度的值。
     * @returns {void}
     */
    public override setLength(value: number): void;

    public override setLength(...params: any): any {
        MemoryStream.prototype.setLength = overload([Number], function (this: MemoryStream, value: number): void {
            this.#checkOpen();

            if (value < 0 || value > MemoryStream.#MEM_STREAM_MAX_LENGTH || value > (Number.MAX_SAFE_INTEGER - this.#origin)) {
                throw new RangeError("“value”必须是非负数，并且小于 2^31 - 1 - origin。");
            }

            const newLength = this.#origin + value;

            const length = this.#length;
            if (!this.#ensureCapacity(newLength) && newLength > length) {
                for (let i = 0; i < newLength - length; i++) {
                    (this.#buffer as Uint8Array)[length + i] = 0;
                }
            }

            this.#length = newLength;

            this.#position = Math.min(this.#position, newLength);
        });

        return MemoryStream.prototype.setLength.apply(this, params);
    }

    /**
     * 将流内容写入字节数组，而与 MemoryStream.position 属性无关。
     * @returns 新的字节数组。
     */
    public toArray(): number[];

    public toArray(...params: any): any {
        MemoryStream.prototype.toArray = overload([], function (this: MemoryStream): number[] {
            this.#checkOpen();

            const copy = new Uint8Array(this.#length - this.#origin);
            _Buffer.blockCopy(this.#buffer as Uint8Array, this.#origin, copy, 0, this.#length - this.#origin);
            return Array.from(copy);
        });

        return MemoryStream.prototype.toArray.apply(this, params);
    }

    /**
     * 使用从缓冲区读取的数据将字节块写入当前流。
     * @param buffer 从中写入数据的缓冲区。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
     * @param count 最多写入的字节数。
     */
    public override write(buffer: Uint8Array, offset: number, count: number): void;

    public override write(...params: any): any {
        MemoryStream.prototype.write = overload([Uint8Array, Number, Number], function (this: MemoryStream, buffer: Uint8Array, offset: number, count: number): void {
            this.#checkOpen();

            if (!this.#writable) {
                throw new Error("当前流不支持写入操作。");
            }

            if (offset < 0) {
                throw new RangeError("“offset”不能小于 0。");
            }

            if (count < 0) {
                throw new RangeError("“count”不能小于 0。");
            }

            if (buffer.length - offset < count) {
                throw new RangeError("“offset”和“count”的总和大于缓冲区长度。");
            }

            const i = this.#position + count;

            if (i < 0) {
                throw new RangeError("流位置超出范围。");
            }

            const length = this.#length;
            if (i > length) {
                let mustZero = this.#position > length;
                if (i > this.#capacity) {
                    const allocatedNewArray = this.#ensureCapacity(i);
                    if (allocatedNewArray) mustZero = false;
                }

                if (mustZero) {
                    for (let n = 0; n < i - length; n++) {
                        (this.#buffer as Uint8Array)[length + n] = 0;
                    }
                }

                this.#length = i;
            }

            const _buffer = this.#buffer as Uint8Array;
            if ((count <= 8) && (buffer != _buffer)) {
                let byteCount = count;
                while (--byteCount >= 0) {
                    _buffer[this.#position + byteCount] = buffer[offset + byteCount];
                }
            } else {
                _Buffer.blockCopy(buffer, offset, _buffer, this.#position, count);
            }

            this.#position = i;
        });

        return MemoryStream.prototype.write.apply(this, params);
    }

    /**
     * 将一个字节写入当前位置上的当前流。
     * @param {Number} value 要写入的字节。
     * @returns {void}
     */
    public override writeByte(value: number): void;

    public override writeByte(...params: any): any {
        MemoryStream.prototype.writeByte = overload([Number], function (this: MemoryStream, value: number): void {
            this.#checkOpen();

            if (!this.#writable) {
                throw new Error("当前流不支持写入操作。");
            }

            value = value | 0;

            if (value < 0 || value > 255) {
                throw new RangeError("“value”必须是非负的并且小于 256。");
            }

            const position = this.#position;
            const length = this.#length;
            if (position >= length) {
                const newLength = position + 1;
                let mustZero = position > length;
                if (newLength >= this.#capacity && this.#ensureCapacity(newLength)) {
                    mustZero = false;
                }

                if (mustZero) {
                    for (let i = 0; i < position - length; i++) {
                        (this.#buffer as Uint8Array)[length + i] = 0;
                    }
                }
                this.#length = newLength;
            }

            (this.#buffer as Uint8Array)[this.#position++] = value;
        });

        return MemoryStream.prototype.writeByte.apply(this, params);
    }

    /**
     * 将此内存流的整个内容写入到另一个流中。
     * @param {Stream} stream 要写入此内存流的流。
     * @returns {void}
     */
    public writeTo(stream: Stream): void;

    public writeTo(...params: any): any {
        MemoryStream.prototype.writeTo = overload([Stream], function (this: MemoryStream, stream: Stream): void {
            this.#checkOpen();

            stream.write(this.#buffer as Uint8Array, this.#origin, this.#length - this.#origin);
        });

        return MemoryStream.prototype.writeTo.apply(this, params);
    }
}