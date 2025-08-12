import overload from "@jyostudio/overload";
import { checkSetterType } from "@jyostudio/overload/dist/decorator.js";
import SeekOrigin from "./seek-origin";
import { setDisposeStatus } from "./_utils";

/**
 * 提供字节序列的一般视图。 这是一个抽象类。
 */
export default abstract class Stream {
    /**
     * 默认的拷贝缓冲区大小。
     */
    static #DEFAULT_COPY_BUFFER_SIZE = 81920;

    /**
     * 无后备存储区的 Stream 实例。
     */
    static #nullInstance: Stream | null = null;

    /**
     * 无后备存储区的 Stream。
     */
    public static get null(): Stream {
        return this.#nullInstance = this.#nullInstance ?? new NullStream();
    }

    /**
     * 当在派生类中重写时，获取指示当前流是否支持超时。
     * @returns 如果流支持超时，为 true；否则为 false。
     */
    public get canTimeout(): boolean {
        return false;
    }

    /**
     * 当在派生类中重写时，获取指示当前流是否支持读取的值。
     * @returns 如果流支持读取，为 true；否则为 false。
     */
    public abstract get canRead(): boolean;

    /**
     * 当在派生类中重写时，获取指示当前流是否支持查找功能的值。
     * @returns 如果流支持查找，为 true；否则为 false。
     */
    public abstract get canSeek(): boolean;

    /**
     * 当在派生类中重写时，获取指示当前流是否支持写入功能的值。
     * @returns 如果流支持写入，则为 true；否则为 false。
     */
    public abstract get canWrite(): boolean;

    /**
     * 当在派生类中重写时，获取流长度（以字节为单位）。
     * @returns 表示流长度（以字节为单位）的长值。
     */
    public abstract get length(): number;

    /**
     * 当在派生类中重写时，获取当前流中的位置。
     * @returns 流中的当前位置。
     */
    public abstract get position(): number;

    /**
     * 当在派生类中重写时，设置当前流中的位置。
     * @param value 当前流中的位置。
     */
    public abstract set position(value: number);

    /**
     * 获取一个值（以毫秒为单位），该值确定流在超时前尝试读取多长时间。
     * @returns 一个确定流在超时前尝试读取多长时间的值（以毫秒为单位）。
     * @throws {EvalError} 如果当前流不支持读取超时。
     */
    public get readTimeout(): number {
        throw new EvalError("当前流不支持读取超时。");
    }

    /**
     * 设置一个值（以毫秒为单位），该值确定流在超时前尝试读取多长时间。
     * @param value 一个确定流在超时前尝试读取多长时间的值（以毫秒为单位）。
     * @throws {EvalError} 如果当前流不支持读取超时。
     * @throws {RangeError} 如果 value 小于 0。
     */
    public set readTimeout(value: number) {
        if (value < 0) {
            throw new RangeError("“value”不能小于 0。");
        }
        throw new EvalError("当前流不支持读取超时。");
    }

    /**
     * 获取一个值（以毫秒为单位），该值确定流在超时前尝试写入多长时间。
     * @returns 如果流支持写入超时，则为超时时间（以毫秒为单位）；否则为 0。
     * @throws {EvalError} 如果当前流不支持写入超时。
     */
    public get writeTimeout(): number {
        throw new EvalError("当前流不支持写入超时。");
    }

    /**
     * 设置一个值（以毫秒为单位），该值确定流在超时前尝试写入多长时间。
     * @param value 一个确定流在超时前尝试写入多长时间的值（以毫秒为单位）。
     * @throws {EvalError} 如果当前流不支持写入超时。
     * @throws {RangeError} 如果 value 小于 0。
     */
    public set writeTimeout(value: number) {
        if (value < 0) {
            throw new RangeError("“value”不能小于 0。");
        }
        throw new EvalError("当前流不支持写入超时。");
    }

    /**
     * 初始化 Stream 类的新实例。
     * @returns Stream 类的新实例。
     * @throws {EvalError} 如果尝试直接实例化 Stream 类。
     */
    protected constructor();

    protected constructor(...params: any) {
        if (new.target === Stream) {
            throw new EvalError("无法创建抽象类“Stream”的实例。");
        }
        overload([], () => { })(...params);
    }

    /**
     * 异步读取当前流中的字节。
     * @param buffer 要读取的字节将存储在此缓冲区中。
     * @param offset 缓冲区中的从零开始的字节偏移量，从此处开始存储从当前流中读取的数据。
     * @param count 要从当前流中最多读取的字节数。
     * @returns 返回一个 Promise，该 Promise 在读取完成时解析为读取的字节数，或者在发生错误时解析为错误对象。
     */
    public readAsync(buffer: Uint8Array, offset: number, count: number): Promise<any>;

    public readAsync(...params: any): any {
        Stream.prototype.readAsync = overload([Uint8Array, Number, Number], function (this: Stream, buffer: Uint8Array, offset: number, count: number): Promise<any> {
            return new Promise((resolve) => {
                if (!this.canRead) {
                    resolve(new EvalError("当前流不支持读取。"));
                    return;
                }

                if (offset < 0 || count < 0 || offset + count > buffer.length) {
                    resolve(new RangeError("“offset”和“count”超出范围。"));
                    return;
                }

                try {
                    const bytesRead = this.read(buffer, offset, count);
                    if (bytesRead < 0) {
                        resolve(new RangeError("流已到达结尾。"));
                        return;
                    }
                    resolve(buffer.slice(offset, offset + bytesRead));
                } catch (error) {
                    resolve(error);
                }
            });
        });

        return Stream.prototype.readAsync.apply(this, params);
    }

    /**
     * 异步将字节写入当前流。
     * @param buffer 要写入的字节。
     * @param offset 缓冲区中的从零开始的字节偏移量，从此处开始将字节写入当前流。
     * @param count 要写入当前流的字节数。
     * @returns 返回一个 Promise，该 Promise 在写入完成时解析为写入的字节数，或者在发生错误时解析为错误对象。
     */
    public writeAsync(buffer: Uint8Array, offset: number, count: number): Promise<any>;

    public writeAsync(...params: any): any {
        Stream.prototype.writeAsync = overload([Uint8Array, Number, Number], function (this: Stream, buffer: Uint8Array, offset: number, count: number): Promise<any> {
            return new Promise((resolve) => {
                if (!this.canWrite) {
                    resolve(new EvalError("当前流不支持写入。"));
                    return;
                }

                if (offset < 0 || count < 0 || offset + count > buffer.length) {
                    resolve(new RangeError("“offset”和“count”超出范围。"));
                    return;
                }

                try {
                    this.write(buffer, offset, count);
                    resolve(count);
                } catch (error) {
                    resolve(error);
                }
            });
        });

        return Stream.prototype.writeAsync.apply(this, params);
    }

    /**
     * 从当前流中读取字节并将其写入到另一流中。
     * @param destination 当前流的内容将复制到的流。
     * @throws {Error} 如果流已关闭，或者目标流已关闭，或者当前流不支持读取操作，或者目标流不支持写入操作。
     */
    public copyTo(destination: Stream): void;

    /**
     * 使用指定的缓冲区大小，从当前流中读取字节并将其写入到另一流中。
     * @param destination 当前流的内容将复制到的流。
     * @param bufferSize 缓冲区的大小。 此值必须大于零。 默认大小为 81920。
     * @throws {Error} 如果流已关闭，或者目标流已关闭，或者当前流不支持读取操作，或者目标流不支持写入操作。
     * @throws {RangeError} 如果缓冲区大小小于等于 0。
     */
    public copyTo(destination: Stream, bufferSize: number): void;

    public copyTo(...params: any): any {
        Stream.prototype.copyTo = overload()
            .add([Stream], function (this: Stream, destination: Stream): void {
                return this.copyTo(destination, Stream.#DEFAULT_COPY_BUFFER_SIZE);
            })
            .add([Stream, Number], function (this: Stream, destination: Stream, bufferSize: number): void {
                if (bufferSize <= 0) {
                    throw new RangeError("缓冲区大小必须大于 0。");
                }

                if (!this.canRead && !this.canWrite) {
                    throw new Error("流已关闭，无法进行读取或写入操作。");
                }

                if (!destination.canRead && !destination.canWrite) {
                    throw new Error("目标流已关闭，无法进行读取或写入操作。");
                }

                if (!this.canRead) {
                    throw new Error("当前流不支持读取操作。");
                }

                if (!destination.canWrite) {
                    throw new Error("目标流不支持写入操作。");
                }

                const buffer = new Uint8Array(bufferSize);

                let bytesRead = 0;

                while ((bytesRead = this.read(buffer, 0, bufferSize)) > 0) {
                    destination.write(buffer, 0, bytesRead);
                }
            });

        return Stream.prototype.copyTo.apply(this, params);
    }

    /**
     * 释放此流使用的所有资源。
     */
    public [Symbol.dispose]() {
        setDisposeStatus(this);
    }

    /**
     * 关闭当前流并释放与之关联的所有资源（如套接字和文件句柄）。
     */
    public close(): void;

    public close(...params: any): any {
        Stream.prototype.close = overload([], function (this: Stream): void {
            this[Symbol.dispose]();
        });
        return Stream.prototype.close.apply(this, params);
    }

    /**
     * 当在派生类中重写时，将清除该流的所有缓冲区，并使得所有缓冲数据被写入到基础设备。
     */
    public abstract flush(): void;

    /**
     * 当在派生类中重写时，设置当前流中的位置。
     * @param offset 相对于 origin 参数的字节偏移量。
     * @param origin SeekOrigin 类型的值，指示用于获取新位置的参考点。
     * @returns 当前流中的新位置。
     */
    public abstract seek(offset: number, origin: SeekOrigin): number;

    /**
     * 当在派生类中重写时，设置当前流的长度。
     * @param value 所需的当前流的长度（以字节表示）。
     */
    public abstract setLength(value: number): void;

    /**
     * 当在派生类中重写时，从当前流读取字节序列，并将此流中的位置提升读取的字节数。
     * @param buffer 字节数组。 此方法返回时，该缓冲区包含指定的字符数组，该数组的 offset 和 (offset + count -1) 之间的值由从当前源中读取的字节替换。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始存储从当前流中读取的数据。
     * @param count 要从当前流中最多读取的字节数。
     * @returns 读入缓冲区中的总字节数。 如果很多字节当前不可用，则总字节数可能小于请求的字节数；如果已到达流结尾，则为零 (0)。
     */
    public abstract read(buffer: Uint8Array, offset: number, count: number): number;

    /**
     * 从流中读取一个字节，并将流内的位置向前提升一个字节，或者如果已到达流结尾，则返回 -1。
     * @returns 强制转换为 Int32 的无符号字节，如果到达流的末尾，则为 -1。
     */
    public readByte(): number;

    public readByte(...params: any): any {
        Stream.prototype.readByte = overload([], function (this: Stream): number {
            if (!this.canRead) {
                throw new EvalError("当前流不支持读取。");
            }

            const oneByteArray = new Uint8Array(1);
            const r = this.read(oneByteArray, 0, 1);
            if (r === 0) {
                return -1;
            }
            return oneByteArray[0];
        });

        return Stream.prototype.readByte.apply(this, params);
    }

    /**
     * 当在派生类中重写时，向当前流中写入字节序列，并将此流中的当前位置提升写入的字节数。
     * @param buffer 字节数组。 此方法将 count 个字节从 buffer 复制到当前流。
     * @param offset buffer 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。
     * @param count 要写入当前流的字节数。
     */
    public abstract write(buffer: Uint8Array, offset: number, count: number): void;

    /**
     * 将一个字节写入流内的当前位置，并将流内的位置向前提升一个字节。
     * @param value 要写入流中的字节。
     * @throws {RangeError} 如果 value 不在 0 到 255 之间。
     */
    public writeByte(value: number): void;

    public writeByte(...params: any): any {
        Stream.prototype.writeByte = overload([Number], function (this: Stream, value: number): void {
            if (!this.canWrite) {
                throw new EvalError("当前流不支持写入。");
            }

            if (value < 0 || value > 255) {
                throw new RangeError("“value”必须是介于 0 到 255 之间的整数。");
            }

            const oneByteArray = new Uint8Array(1);
            oneByteArray[0] = value;
            this.write(oneByteArray, 0, 1);
        });

        return Stream.prototype.writeByte.apply(this, params);
    }
}

class NullStream extends Stream {
    public override get canRead(): boolean {
        return true;
    }

    public override get canWrite(): boolean {
        return true;
    }

    public override get canSeek(): boolean {
        return true;
    }

    public override get length(): number {
        return 0;
    }

    public override get position(): number {
        return 0;
    }

    @checkSetterType(Number)
    public override set position(value: number) { }

    public override flush(...params: any): any {
        Stream.prototype.flush = overload([], function (): void { });
        return Stream.prototype.flush.apply(this, params);
    }

    public override seek(...params: any): any {
        Stream.prototype.seek = overload([Number, SeekOrigin], function (this: Stream, offset: number, origin: SeekOrigin): number {
            return 0;
        });
        return Stream.prototype.seek.apply(this, params);
    }

    public override setLength(...params: any): any {
        Stream.prototype.setLength = overload([Number], function (this: Stream, value: number): void { });
        return Stream.prototype.setLength.apply(this, params);
    }

    public override read(...params: any): any {
        Stream.prototype.read = overload([Uint8Array, Number, Number], function (this: Stream, buffer: Uint8Array, offset: number, count: number): number {
            return 0;
        });
        return Stream.prototype.read.apply(this, params);
    }

    public override readByte(...params: any): any {
        Stream.prototype.readByte = overload([], function (this: Stream): number {
            return -1;
        });

        return Stream.prototype.readByte.apply(this, params);
    }

    public override write(...params: any): any {
        Stream.prototype.write = overload([Uint8Array, Number, Number], function (this: Stream, buffer: Uint8Array, offset: number, count: number): void { });
        return Stream.prototype.write.apply(this, params);
    }

    public override writeByte(...params: any): any {
        Stream.prototype.writeByte = overload([Number], function (this: Stream, value: number): void { });
        return Stream.prototype.writeByte.apply(this, params);
    }
}