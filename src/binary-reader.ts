import overload from "@jyostudio/overload";
import { checkSetterType } from "@jyostudio/overload/dist/decorator";
import { Encoding, UTF8Encoding } from "@jyostudio/text";
import _Buffer from "./_buffer";
import SeekOrigin from "./seek-origin";
import Stream from "./stream";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 用特定的编码将基元数据类型读作二进制值。
 */
export default class BinaryReader {
    /**
     * 基础流
     */
    #stream: Stream | null = null;

    /**
     * 用于读取数据的字符编码
     */
    #encoding: Encoding | null = null;

    /**
     * 用于读取数据的字节缓冲区
     */
    #buffer: Uint8Array | null = null;

    /**
     * 用于读取数据的视图
     */
    #view: DataView | null = null;

    /**
     * 用于读取数据的字符字节数组
     */
    #charBytes: Uint8Array | null = null;

    /**
     * 表示当前流是否使用大端字节序。
     */
    #bigEndian: boolean = false;

    /**
     * 获取一个值，该值指示当前流是否使用大端字节序。
     * @returns 如果流使用大端字节序，则为 true；否则为 false。
     */
    public get bigEndian(): boolean {
        return this.#bigEndian;
    }

    /**
     * 设置一个值，该值指示当前流是否使用大端字节序。
     * @param value 如果流使用大端字节序，则为 true；否则为 false。
     */
    @checkSetterType(Boolean)
    public set bigEndian(value: boolean) {
        this.#bigEndian = value;
    }

    /**
     * 公开对 BinaryReader 的基础流的访问。
     * @returns 与 BinaryReader 关联的基础流。
     */
    public get baseStream(): Stream | null {
        return this.#stream;
    }

    /**
     * 基于所指定的流和特定的 UTF-8 编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     */
    public constructor(input: Stream);

    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     * @param encoding 要使用的字符编码。
     */
    public constructor(input: Stream, encoding: Encoding);

    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryReader 类的新实例。
     * @param input 输入流。
     * @param encoding 要使用的字符编码。
     * @param bigEndian 是否使用大端字节序。
     */
    public constructor(input: Stream, encoding: Encoding, bigEndian: boolean);

    public constructor(...params: any) {
        return BinaryReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): BinaryReader {
        BinaryReader[CONSTRUCTOR_SYMBOL] = overload()
            .add([Stream], function (this: BinaryReader, input: Stream) {
                return BinaryReader[CONSTRUCTOR_SYMBOL].call(this, input, new UTF8Encoding(), false);
            })
            .add([Stream, Encoding], function (this: BinaryReader, input: Stream, encoding: Encoding) {
                return BinaryReader[CONSTRUCTOR_SYMBOL].call(this, input, encoding, false);
            })
            .add([Stream, Encoding, Boolean], function (this: BinaryReader, input: Stream, encoding: Encoding, bigEndian: boolean) {
                if (!input.canRead) throw new EvalError("这个流不支持读取。");

                this.#stream = input;
                this.#encoding = encoding;
                this.#bigEndian = bigEndian;
                this.#buffer = new Uint8Array(input.length);
                this.#view = new DataView(this.#buffer.buffer);
                this.#charBytes = new Uint8Array(12);
            });

        return BinaryReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 用从流中读取的指定字节数填充内部缓冲区。
     * @param numBytes 要读取的字节数。
     */
    #fillBuffer(numBytes: number): void {
        const buffer = this.#buffer as Uint8Array;
        const stream = this.#stream as Stream;

        if (!stream.canRead) {
            throw new EvalError("当前流不支持读取。");
        }

        if (numBytes < 0 || numBytes > buffer.byteLength) {
            throw new RangeError("“numBytes”超出范围。");
        }

        let bytesRead = 0;
        let n = 0;

        if (numBytes === 1) {
            n = stream.readByte();
            if (n === -1) throw new RangeError("流已到达结尾。");
            buffer[0] = n;
            return;
        }

        do {
            n = stream.read(buffer, bytesRead, numBytes - bytesRead);
            if (n === 0) throw new RangeError("流已到达结尾。");
            bytesRead += n;
        } while (bytesRead < numBytes);
    }

    /**
     * 释放此读取器使用的所有资源。
     */
    public [Symbol.dispose]() {
        this.#stream?.close();
        this.#stream = null;
        this.#encoding = null;
        this.#buffer = null;
        this.#view = null;
        this.#charBytes = null;

        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            try {
                if (key === "constructor") continue;
                if (typeof (this as any)[key] === "function") {
                    (this as any)[key] = () => {
                        throw new EvalError("BinaryReader 实例已被释放，无法调用方法。");
                    };
                } else if (key !== "constructor") {
                    Object.defineProperty(this, key, {
                        get: () => {
                            throw new EvalError("BinaryReader 实例已被释放，无法访问属性。");
                        },
                        set: () => {
                            throw new EvalError("BinaryReader 实例已被释放，无法设置属性。");
                        }
                    });
                }
            } catch { }
        }
    }

    /**
     * 关闭当前阅读器及基础流。
     */
    public close(): void;

    public close(...params: any): any {
        BinaryReader.prototype.close = overload([], function (this: BinaryReader): void {
            this[Symbol.dispose]();
        });

        return BinaryReader.prototype.close.apply(this, params);
    }

    /**
     * 返回下一个可用的字符，并且不提升字节或字符的位置。
     * @returns 下一个可用的字符，或者，如果没有可用字符或者流不支持查找时为 -1。
     */
    public peekChar(): number;

    public peekChar(...params: any): any {
        BinaryReader.prototype.peekChar = overload([], function (this: BinaryReader): number {
            if (!this.#stream!.canSeek) {
                return -1;
            }

            const origPos = this.#stream!.position;
            const ch = this.read();
            this.#stream!.position = origPos;
            return ch;
        });

        return BinaryReader.prototype.peekChar.apply(this, params);
    }

    /**
     * 从基础流中读取字符，并根据所使用的 Encoding 和从流中读取的特定字符，提升流的当前位置。
     * @returns 输入流中的下一个字符，如果当前无可用字符则为 -1。
     */
    public read(): number;

    /**
     * 从字节数组中的指定点开始，从流中读取指定的字节数。
     * @param buffer 将数据读入的缓冲区。
     * @param index 缓冲区中的起始点，在该处开始读入缓冲区。
     * @param count 要读取的字节数。
     * @returns 读入 buffer 的字节数。 如果可用的字节没有请求的那么多，此数可能小于所请求的字节数；如果到达了流的末尾，此数可能为零。
     */
    public read(buffer: Uint8Array, index: number, count: number): number;

    /**
     * 从字符数组中的指定点开始，从流中读取指定的字符数。
     * @param buffer 将数据读入的缓冲区。
     * @param index 缓冲区中的起始点，在该处开始读入缓冲区。
     * @param count 要读取的字符数。
     * @returns 读入缓冲区的总字符数。 如果当前可用的字节没有请求的那么多，此数可能小于所请求的字符数；如果到达了流的末尾，此数可能为零。
     */
    public read(buffer: Array<string>, index: number, count: number): number;

    public read(...params: any): any {
        BinaryReader.prototype.read = overload()
            .add([], function (this: BinaryReader): number {
                const length = 1;
                const encoding = this.#encoding as Encoding;
                if (encoding instanceof UTF8Encoding) {
                    let charBytes = this.#charBytes as Uint8Array;
                    let hasBytesCount = 0;
                    charBytes[0] = this.#stream!.readByte();
                    let r = charBytes[0].toString(2).padStart(8, "0");

                    for (let i = 0; i < r.length; i++) {
                        if (r[i] === "1" && i === hasBytesCount) {
                            hasBytesCount++;
                        } else {
                            break;
                        }
                    }

                    if (hasBytesCount) {
                        hasBytesCount--;
                    }

                    for (let i = 0; i < hasBytesCount; i++) {
                        charBytes[i + 1] = this.#stream!.readByte();
                    }

                    return encoding.getString(charBytes, 0, hasBytesCount + 1).charCodeAt(0);
                }

                const charBytes = new Uint8Array(length);

                for (let i = 0; i < length; i++) {
                    let r = this.#stream!.readByte();
                    charBytes[i] = r;
                }

                return encoding.getString(charBytes).charCodeAt(0);
            })
            .add([Uint8Array, Number, Number], function (this: BinaryReader, buffer: Uint8Array, index: number, count: number) {
                if (index < 0) {
                    throw new RangeError("“index”超出范围。");
                }

                if (count < 0) {
                    throw new RangeError("“count”超出范围。");
                }

                if (buffer.byteLength - index < count) {
                    throw new Error("缓冲区太小。");
                }

                return this.#stream!.read(buffer, index, count);
            })
            .add([Array, Number, Number], function (this: BinaryReader, buffer: Array<string>, index: number, count: number) {
                for (let i = 0; i < count; i++) {
                    buffer[index + i] = this.readChar();
                }

                return count;
            });

        return BinaryReader.prototype.read.apply(this, params);
    }

    /**
     * 以压缩格式读入 32 位整数。
     * @returns 压缩格式的 32 位整数。
     */
    public read7BitEncodedInt(): number;

    public read7BitEncodedInt(...params: any): any {
        BinaryReader.prototype.read7BitEncodedInt = overload([], function (this: BinaryReader): number {
            let count = 0;
            let shift = 0;
            let b;

            do {
                if (shift === 5 * 7) {
                    throw new SyntaxError("无效的 7 位编码整数。");
                }

                b = this.readByte();
                count |= (b & 0x7F) << shift;
                shift += 7;
            } while ((b & 0x80) !== 0);

            return count;
        });

        return BinaryReader.prototype.read7BitEncodedInt.apply(this, params);
    }

    /**
     * 从当前流中读取 Boolean 值，并使该流的当前位置提升 1 个字节。
     * @returns 如果字节为非零，则为 true，否则为 false。
     */
    public readBoolean(): boolean;

    public readBoolean(...params: any): any {
        BinaryReader.prototype.readBoolean = overload([], function (this: BinaryReader): boolean {
            this.#fillBuffer(1);
            return this.#buffer![0] !== 0;
        });

        return BinaryReader.prototype.readBoolean.apply(this, params);
    }

    /**
     * 从当前流中读取下一个字节，并使流的当前位置提升 1 个字节。
     * @returns 从当前流中读取的下一个字节。
     */
    public readByte(): number;

    public readByte(...params: any): any {
        BinaryReader.prototype.readByte = overload([], function (this: BinaryReader): number {
            const b = this.#stream!.readByte();
            if (b === -1) {
                throw new Error("流已到达结尾。");
            }
            return b;
        });

        return BinaryReader.prototype.readByte.apply(this, params);
    }

    /**
     * 从当前流中读取指定的字节数以写入字节数组中，并将当前位置前移相应的字节数。
     * @param count 要读取的字节数。 此值必须为 0 或非负数字，否则将出现异常。
     * @returns 包含从基础流中读取的数据的字节数组。 如果到达了流的末尾，则该字节数组可能小于所请求的字节数。
     */
    public readBytes(count: number): Uint8Array;

    public readBytes(...params: any): any {
        BinaryReader.prototype.readBytes = overload([Number], function (this: BinaryReader, count: number): Uint8Array {
            if (count === 0) {
                return new Uint8Array(0);
            }

            let result = new Uint8Array(count);
            let numRead = 0;

            do {
                const n = this.#stream!.read(result, numRead, count);
                if (n === 0) {
                    break;
                }
                numRead += n;
                count -= n;
            } while (count > 0);

            if (numRead != result.length) {
                const copy = new Uint8Array(numRead);
                _Buffer.blockCopy(result, 0, copy, 0, numRead);
                result = copy;
            }

            return result;
        });

        return BinaryReader.prototype.readBytes.apply(this, params)
    }

    /**
     * 从当前流中读取下一个字符，并根据所使用的 Encoding 和从流中读取的特定字符，提升流的当前位置。
     * @returns 从当前流中读取的字符。
     */
    public readChar(): string;

    public readChar(...params: any): any {
        BinaryReader.prototype.readChar = overload([], function (this: BinaryReader): string {
            const value = this.read();
            if (value === -1) {
                throw new Error("流已到达结尾。");
            }
            return String.fromCharCode(value);
        });

        return BinaryReader.prototype.readChar.apply(this, params);
    }

    /**
     * 从当前流中读取指定的字符数，并以字符数组的形式返回数据，然后根据所使用的 Encoding 和从流中读取的特定字符，将当前位置前移。
     * @param count 要读取的字符数。
     * @returns 包含从基础流中读取的数据的字符数组。 如果到达了流的末尾，则该字符数组可能小于所请求的字符数。
     */
    public readChars(count: number): Array<string>;

    public readChars(...params: any): any {
        BinaryReader.prototype.readChars = overload([Number], function (this: BinaryReader, count: number): Array<string> {
            const chars = [];
            for (let i = 0; i < count; i++) {
                chars[i] = this.readChar();
            }
            return chars;
        });

        return BinaryReader.prototype.readChars.apply(this, params)
    }

    /**
     * 从当前流中读取具有 15 位整数和 16 位小数的定点数。
     * @returns 从当前流中读取的具有 15 位整数和 16 位小数的定点数。
     */
    public readS15Fixed16(): number;

    public readS15Fixed16(...params: any): any {
        BinaryReader.prototype.readS15Fixed16 = overload([], function (this: BinaryReader): number {
            if (!this.#bigEndian) {
                // 小端序：先读小数部分，再读整数部分
                const fractional = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                const integer = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;

                // 处理符号：最高位是符号位，剩下15位是整数部分
                const isNegative = (integer & 0x8000) !== 0;
                // 取低15位作为整数部分
                const integerPart = integer & 0x7FFF;

                const result = integerPart + fractional / 65536;
                return isNegative ? -result : result;
            } else {
                // 大端序：先读整数部分，再读小数部分
                const integer = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                const fractional = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);

                // 处理符号：最高位是符号位，剩下15位是整数部分
                const isNegative = (integer & 0x8000) !== 0;
                // 取低15位作为整数部分
                const integerPart = integer & 0x7FFF;

                const result = integerPart + fractional / 65536;
                return isNegative ? -result : result;
            }
        });

        return BinaryReader.prototype.readS15Fixed16.apply(this, params);
    }

    /**
     * 从当前流中读取具有 16 位整数和 16 位小数的定点数。
     * @returns 从当前流中读取的具有 16 位整数和 16 位小数的定点数。
     */
    public readFixed(): number;

    public readFixed(...params: any): any {
        BinaryReader.prototype.readFixed = overload([], function (this: BinaryReader): number {
            if (!this.#bigEndian) {
                // 小端序：先读小数部分，再读整数部分
                const fractional = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                const integer = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;

                // 16.16 无符号定点数：16位整数 + 16位小数
                return integer + fractional / 65536;
            } else {
                // 大端序：先读整数部分，再读小数部分
                const integer = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                const fractional = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);

                // 16.16 无符号定点数：16位整数 + 16位小数
                return integer + fractional / 65536;
            }
        });

        return BinaryReader.prototype.readFixed.apply(this, params);
    }

    /**
     * 从当前流中读取 8 字节浮点值，并使流的当前位置提升 8 个字节。
     * @returns 从当前流中读取的 8 字节浮点值。
     */
    public readDouble(): number;

    public readDouble(...params: any): any {
        BinaryReader.prototype.readDouble = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 8);
            return this.#view!.getFloat64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readDouble.apply(this, params);
    }

    /**
     * 从当前流中读取 2 字节有符号整数，并使流的当前位置提升 2 个字节。
     * @returns 从当前流中读取的 2 字节有符号整数。
     */
    public readInt16(): number;

    public readInt16(...params: any): any {
        BinaryReader.prototype.readInt16 = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 2);
            return this.#view!.getInt16(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt16.apply(this, params);
    }

    /**
     * 从当前流中读取 4 字节有符号整数，并使流的当前位置提升 4 个字节。
     * @returns 从当前流中读取的 4 字节有符号整数。
     */
    public readInt32(): number;

    public readInt32(...params: any): any {
        BinaryReader.prototype.readInt32 = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 4);
            return this.#view!.getInt32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt32.apply(this, params);
    }

    /**
     * 从当前流中读取 8 字节有符号整数，并使流的当前位置提升 8 个字节。
     * @returns 从当前流中读取的 8 字节有符号整数。
     */
    public readInt64(): bigint;

    public readInt64(...params: any): any {
        BinaryReader.prototype.readInt64 = overload([], function (this: BinaryReader): bigint {
            this.#fillBuffer.call(this, 8);
            return this.#view!.getBigInt64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt64.apply(this, params);
    }

    /**
     * 从此流中读取 1 个有符号字节，并使流的当前位置提升 1 个字节。
     * @returns 从当前流中读取的一个有符号字节。
     */
    public readSByte(): number;

    public readSByte(...params: any): any {
        BinaryReader.prototype.readSByte = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 1);
            let value = this.#buffer![0];
            if (value > 127) {
                value -= 256;
            }
            return value;
        });

        return BinaryReader.prototype.readSByte.apply(this, params);
    }

    /**
     * 从当前流中读取 4 字节浮点值，并使流的当前位置提升 4 个字节。
     * @returns 从当前流中读取的 4 字节浮点值。
     */
    public readSingle(): number;

    public readSingle(...params: any): any {
        BinaryReader.prototype.readSingle = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 4);
            return this.#view!.getFloat32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readSingle.apply(this, params);
    }

    /**
     * 从当前流中读取一个字符串。 字符串有长度前缀，一次 7 位地被编码为整数。
     * @returns 正被读取的字符串。
     */
    public readString(): string;

    /**
     * 从当前流中读取一个字符串。 无前缀，字符长度根据参数指定。
     * @param count 要读取的字符数。
     * @returns 正被读取的字符串。
     */
    public readString(count: number): string;

    public readString(...params: any): any {
        BinaryReader.prototype.readString = overload()
            .add([], function (this: BinaryReader): string {
                const length = this.read7BitEncodedInt();
                return this.#encoding!.getString(new Uint8Array(this.readBytes(length)));
            })
            .add([Number], function (this: BinaryReader, count: number) {
                return this.readChars(count).join("");
            });

        return BinaryReader.prototype.readString.apply(this, params);
    }

    /**
     * 从当前流中读取 2 字节无符号整数，并将流的位置提升 2 个字节。
     * @returns 从该流中读取的 2 字节无符号整数。
     */
    public readUInt16(): number;

    public readUInt16(...params: any): any {
        BinaryReader.prototype.readUInt16 = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 2);
            return this.#view!.getUint16(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt16.apply(this, params);
    }

    /**
     * 从当前流中读取 4 字节无符号整数并使流的当前位置提升 4 个字节。
     * @returns 从该流中读取的 4 字节无符号整数。
     */
    public readUInt32(): number;

    public readUInt32(...params: any): any {
        BinaryReader.prototype.readUInt32 = overload([], function (this: BinaryReader): number {
            this.#fillBuffer.call(this, 4);
            return this.#view!.getUint32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt32.apply(this, params);
    }

    /**
     * 从当前流中读取 8 字节无符号整数并使流的当前位置提升 8 个字节。
     * @returns 从该流中读取的 8 字节无符号整数。
     */
    public readUInt64(): bigint;

    public readUInt64(...params: any): any {
        BinaryReader.prototype.readUInt64 = overload([], function (this: BinaryReader): bigint {
            this.#fillBuffer.call(this, 8);
            return this.#view!.getBigUint64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt64.apply(this, params);
    }

    /**
     * 读取指针区域。
     * @param moveTo 指针地址。
     * @param action 回调函数。
     * @returns 回调函数的返回值。
     */
    public pointer(moveTo: number, action: Function): Promise<any>;

    public pointer(...params: any): any {
        BinaryReader.prototype.pointer = overload([Number, Function], async function (this: BinaryReader, moveTo: number, action: Function): Promise<any> {
            if (!this.#stream!.canSeek) {
                throw new EvalError("当前流不支持查找。");
            }

            const position = this.#stream!.position;
            this.#stream!.seek(moveTo, SeekOrigin.begin);
            const res = await action();
            this.#stream!.seek(position, SeekOrigin.begin);
            return res;
        });

        return BinaryReader.prototype.pointer.apply(this, params);
    }
}