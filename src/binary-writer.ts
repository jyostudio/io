import List from "@jyostudio/list";
import overload from "@jyostudio/overload";
import { checkSetterType } from "@jyostudio/overload/dist/decorator";
import { Encoding, StringBuilder, UTF8Encoding } from "@jyostudio/text";
import SeekOrigin from "./seek-origin";
import Stream from "./stream";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 将二进制中的基元类型写入流并支持用特定的编码写入字符串。
 */
export default class BinaryWriter {
    /**
     * 指定无后备存储的 BinaryWriter。
     */
    static #null: BinaryWriter | null = null;

    /**
     * 指定无后备存储的 BinaryWriter。
     * @returns 无后备存储的 BinaryWriter。
     */
    static get null(): BinaryWriter {
        return this.#null ??= new BinaryWriter(Stream.null);
    }

    /**
     * 基础流
     */
    #stream: Stream | null = null;

    /**
     * 用于写入数据的字节缓冲区
     */
    #buffer: Uint8Array | null = null;

    /**
     * 用于写入数据的视图
     */
    #view: DataView | null = null;

    /**
     * 用于写入数据的字符编码
     */
    #encoding: Encoding | null = null;

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
     * 获取 BinaryWriter 的基础流。
     * @returns 与 BinaryWriter 关联的基础流。
     */
    public get baseStream(): Stream | null {
        return this.#stream;
    }

    /**
     * 基于所指定的流和特定的 UTF-8 编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     */
    public constructor(output: Stream);

    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     * @param encoding 要使用的字符编码。
     */
    public constructor(output: Stream, encoding: Encoding);

    /**
     * 基于所指定的流和特定的字符编码，初始化 BinaryWriter 类的新实例。
     * @param output 输出流。
     * @param encoding 要使用的字符编码。
     * @param bigEndian 是否使用大端字节序。
     */
    public constructor(output: Stream, encoding: Encoding, bigEndian: boolean);

    public constructor(...params: any) {
        return BinaryWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): BinaryWriter {
        BinaryWriter[CONSTRUCTOR_SYMBOL] = overload()
            .add([Stream], function (this: BinaryWriter, output: Stream) {
                return BinaryWriter[CONSTRUCTOR_SYMBOL].call(this, output, new UTF8Encoding(), false);
            })
            .add([Stream, Encoding], function (this: BinaryWriter, output: Stream, encoding: Encoding) {
                return BinaryWriter[CONSTRUCTOR_SYMBOL].call(this, output, encoding, false);
            })
            .add([Stream, Encoding, Boolean], function (this: BinaryWriter, output: Stream, encoding: Encoding, bigEndian: boolean) {
                if (!output.canWrite) throw new EvalError("这个流不支持写入。");

                this.#stream = output;
                this.#encoding = encoding;
                this.#bigEndian = bigEndian;
                this.#buffer = new Uint8Array(16);
                this.#view = new DataView(this.#buffer.buffer);
            });

        return BinaryWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 关闭当前的 BinaryWriter 和基础流。
     */
    public close(): void;

    public close(...params: any): any {
        BinaryWriter.prototype.close = overload([], function (this: BinaryWriter): void {
            BinaryWriter.prototype[Symbol.dispose].apply(this);
        });

        return BinaryWriter.prototype.close.apply(this, params);
    }

    /**
     * 释放此写入器使用的所有资源。
     */
    public [Symbol.dispose]() {
        this.#stream!.close();
        this.#stream = null;
        this.#encoding = null;
        this.#buffer = null;
        this.#view = null;

        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            try {
                if (key === "constructor") continue;
                if (typeof (this as any)[key] === "function") {
                    (this as any)[key] = () => {
                        throw new EvalError("BinaryWriter 实例已被释放，无法调用方法。");
                    };
                } else if (key !== "constructor") {
                    Object.defineProperty(this, key, {
                        get: () => {
                            throw new EvalError("BinaryWriter 实例已被释放，无法访问属性。");
                        },
                        set: () => {
                            throw new EvalError("BinaryWriter 实例已被释放，无法设置属性。");
                        }
                    });
                }
            } catch { }
        }
    }

    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     */
    public flush(): void;

    public flush(...params: any): any {
        BinaryWriter.prototype.flush = overload([], function (this: BinaryWriter): void {
            this.#stream!.flush();
        });

        return BinaryWriter.prototype.flush.apply(this, params);
    }

    /**
     * 设置当前流中的位置。
     * @param offset 相对于 origin 的字节偏移量。
     * @param origin SeekOrigin 的一个字段，指示获取新位置所依据的参考点。
     * @returns 包含当前流的位置。
     */
    public seek(offset: number, origin: SeekOrigin): number;

    public seek(...params: any): any {
        BinaryWriter.prototype.seek = overload([Number, SeekOrigin], function (this: BinaryWriter, offset: number, origin: SeekOrigin): number {
            return this.#stream!.seek(offset, origin);
        });

        return BinaryWriter.prototype.seek.apply(this, params);
    }

    /**
     * 将单字节 Boolean 值写入当前流，其中 0 表示 false，1 表示 true。
     * @param value 要写入的 Boolean 值。
     */
    public writeBoolean(value: boolean): void;

    public writeBoolean(...params: any): any {
        BinaryWriter.prototype.writeBoolean = overload([Boolean], function (this: BinaryWriter, value: boolean): void {
            this.#view!.setUint8(0, value ? 1 : 0);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 1);
        });

        return BinaryWriter.prototype.writeBoolean.apply(this, params);
    }

    /**
     * 将一个无符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param value 要写入的无符号字节。
     */
    public writeByte(value: number): void;

    public writeByte(...params: any): any {
        BinaryWriter.prototype.writeByte = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#stream!.writeByte(value);
        });

        return BinaryWriter.prototype.writeByte.apply(this, params);
    }

    /**
     * 将字节数组写入基础流。
     * @param buffer 包含要写入的数据的字节数组。
     */
    public writeBytes(buffer: Uint8Array): void;

    /**
     * 将字节数组区域写入当前流。
     * @param buffer 包含要写入的数据的字节数组。
     * @param index 要从 buffer 中读取且要写入流的第一个字节的索引。
     * @param count 要从 buffer 中读取且要写入流的字节数。
     */
    public writeBytes(buffer: Uint8Array, index: number, count: number): void;

    public writeBytes(...params: any): any {
        BinaryWriter.prototype.writeBytes = overload()
            .add([Uint8Array], function (this: BinaryWriter, buffer: Uint8Array): void {
                this.#stream!.write(buffer, 0, buffer.length);
            })
            .add([Uint8Array, Number, Number], function (this: BinaryWriter, buffer: Uint8Array, index: number, count: number): void {
                this.#stream!.write(buffer, index, count);
            });

        return BinaryWriter.prototype.writeBytes.apply(this, params);
    }

    /**
     * 将 Unicode 字符写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param ch 要写入的非代理项 Unicode 字符。
     */
    public writeChar(ch: string): void;

    public writeChar(...params: any): any {
        BinaryWriter.prototype.writeChar = overload([String], function (this: BinaryWriter, value: string): void {
            if (value.length !== 1) {
                throw new RangeError("值必须是单个字符。");
            }

            const bytes = this.#encoding!.getBytes(value);
            this.#stream!.write(bytes, 0, bytes.length);
        });

        return BinaryWriter.prototype.writeChar.apply(this, params);
    }

    /**
     * 将字符数组写入当前流，并根据所使用的 Encoding 和向流中写入的特定字符，提升流的当前位置。
     * @param chars 包含要写入的数据的字符数组。
     */
    public writeChars(chars: List<string>): void;

    /**
     * 将字符数组部分写入当前流，并根据所使用的 Encoding（可能还根据向流中写入的特定字符），提升流的当前位置。
     * @param chars 包含要写入的数据的字符数组。
     * @param index 要从 chars 中读取且要写入流的第一个字符的索引。
     * @param count 要从 chars 中读取且要写入流的字符数。
     */
    public writeChars(chars: List<string>, index: number, count: number): void;

    public writeChars(...params: any): any {
        BinaryWriter.prototype.writeChars = overload()
            .add([List.T(String)], function (this: BinaryWriter, value: List<string>): void {
                this.writeChars.call(this, value, 0, value.length);
            })
            .add([List.T(String), Number, Number], function (this: BinaryWriter, chars: List<string>, index: number, count: number): void {
                const str = new StringBuilder();

                for (let i = index; i < index + count; i++) {
                    if (chars[i].length !== 1) {
                        throw new RangeError("值必须是单个字符。");
                    }
                    str.append(chars[i]);
                }

                const bytes = this.#encoding!.getBytes(str.toString());
                this.#stream!.write(bytes, 0, bytes.length);
            });

        return BinaryWriter.prototype.writeChars.apply(this, params);
    }

    /**
     * 将 8 字节浮点值写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节浮点值。
     */
    public writeDouble(value: number): void;

    public writeDouble(...params: any): any {
        BinaryWriter.prototype.writeDouble = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setFloat64(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 8);
        });

        return BinaryWriter.prototype.writeDouble.apply(this, params);
    }

    /**
     * 将 4 字节浮点值写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节浮点值。
     */
    public writeSingle(value: number): void;

    public writeSingle(...params: any): any {
        BinaryWriter.prototype.writeSingle = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setFloat32(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 4);
        });

        return BinaryWriter.prototype.writeSingle.apply(this, params);
    }

    /**
     * 将有长度前缀的字符串按 BinaryWriter 的当前编码写入此流，并根据所使用的编码和写入流的特定字符，提升流的当前位置。
     * @param value 要写入的值。
     */
    public writeString(value: string): void;

    public writeString(...params: any): any {
        BinaryWriter.prototype.writeString = overload([String], function (this: BinaryWriter, value: string): void {
            const bytes = this.#encoding!.getBytes(value);
            this.write7BitEncodedInt(bytes.length);
            this.#stream!.write(bytes, 0, bytes.length);
        });

        return BinaryWriter.prototype.writeString.apply(this, params);
    }

    /**
     * 将 2 字节带符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param value 要写入的 2 字节带符号整数。
     */
    public writeInt16(value: number): void;

    public writeInt16(...params: any): any {
        BinaryWriter.prototype.writeInt16 = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setInt16(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 2);
        });

        return BinaryWriter.prototype.writeInt16.apply(this, params);
    }

    /**
     * 将 4 字节带符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节带符号整数。
     */
    public writeInt32(value: number): void;

    public writeInt32(...params: any): any {
        BinaryWriter.prototype.writeInt32 = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setInt32(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 4);
        });

        return BinaryWriter.prototype.writeInt32.apply(this, params);
    }

    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节带符号整数。
     */
    public writeInt64(value: number): void;

    /**
     * 将 8 字节带符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节带符号整数。
     */
    public writeInt64(value: bigint): void;

    public writeInt64(...params: any): any {
        BinaryWriter.prototype.writeInt64 = overload([[Number, BigInt]], function (this: BinaryWriter, value: number | bigint): void {
            this.#view!.setBigInt64(0, BigInt(value), !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 8);
        });

        return BinaryWriter.prototype.writeInt64.apply(this, params);
    }

    /**
     * 将一个带符号字节写入当前流，并将流的位置提升 1 个字节。
     * @param value 要写入的带符号字节。
     * @throws {RangeError} 如果值不在 -128 到 127 之间。
     */
    public writeSByte(value: number): void;

    public writeSByte(...params: any): any {
        BinaryWriter.prototype.writeSByte = overload([Number], function (this: BinaryWriter, value: number): void {
            if (value > 127) {
                value -= 256;
            }

            if (value < -128 || value > 127) {
                throw new RangeError("值必须在 -128 到 127 之间。");
            }

            this.#view!.setInt8(0, value);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 1);
        });

        return BinaryWriter.prototype.writeSByte.apply(this, params);
    }

    /**
     * 将 2 字节无符号整数写入当前流，并将流的位置提升 2 个字节。
     * @param value 要写入的 2 字节无符号整数。
     */
    public writeUInt16(value: number): void;

    public writeUInt16(...params: any): any {
        BinaryWriter.prototype.writeUInt16 = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setUint16(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 2);
        });

        return BinaryWriter.prototype.writeUInt16.apply(this, params);
    }

    /**
     * 将 4 字节无符号整数写入当前流，并将流的位置提升 4 个字节。
     * @param value 要写入的 4 字节无符号整数。
     */
    public writeUInt32(value: number): void;

    public writeUInt32(...params: any): any {
        BinaryWriter.prototype.writeUInt32 = overload([Number], function (this: BinaryWriter, value: number): void {
            this.#view!.setUint32(0, value, !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 4);
        });

        return BinaryWriter.prototype.writeUInt32.apply(this, params);
    }

    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节无符号整数。
     */
    public writeUInt64(value: number): void;

    /**
     * 将 8 字节无符号整数写入当前流，并将流的位置提升 8 个字节。
     * @param value 要写入的 8 字节无符号整数。
     */
    public writeUInt64(value: bigint): void;

    public writeUInt64(...params: any): any {
        BinaryWriter.prototype.writeUInt64 = overload([[Number, BigInt]], function (this: BinaryWriter, value: number | bigint): void {
            this.#view!.setBigUint64(0, BigInt(value), !this.#bigEndian);
            this.#stream!.write(this.#buffer as Uint8Array, 0, 8);
        });

        return BinaryWriter.prototype.writeUInt64.apply(this, params);
    }

    /**
     * 以压缩格式写入 32 位整数。
     * @param value 要写入的 32 位整数。
     */
    public write7BitEncodedInt(value: number): void;

    public write7BitEncodedInt(...params: any): any {
        BinaryWriter.prototype.write7BitEncodedInt = overload([Number], function (this: BinaryWriter, value: number): void {
            let v = +value;
            while (v >= 0x80) {
                this.writeByte(v | 0x80);
                v >>= 7;
            }
            this.writeByte(v);
        });

        return BinaryWriter.prototype.write7BitEncodedInt.apply(this, params);
    }
}
