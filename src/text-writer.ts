import overload from "@jyostudio/overload";
import { checkSetterType } from "@jyostudio/overload/dist/decorator.js";
import { Encoding } from "@jyostudio/text";
import { setDisposeStatus } from "./_utils";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 表示可以编写一个有序字符系列的编写器。
 */
export default abstract class TextWriter {
    /**
     * 指定无后备存储的 TextWriter。
     */
    static #null: NullTextWriter | null = null;

    /**
     * 提供 TextWriter，它不带任何可写入但无法从中读取的后备存储。
     * @returns 无后备存储的 TextWriter。
     */
    static get null(): NullTextWriter {
        return this.#null ??= new NullTextWriter();
    }

    /**
     * 初始换行符
     */
    #initialNewLine = "\r\n";

    /**
     * 核心换行符字符数组
     */
    #coreNewLine: string[] = ["\r", "\n"];

    /**
     * 获取由当前 TextWriter 使用的行结束符字符串。
     * @returns 当前 TextWriter 的行结束符字符串。
     */
    public get newLine(): string {
        return this.#coreNewLine.join("");
    }

    /**
     * 设置由当前 TextWriter 使用的行结束符字符串。
     * @param value 当前 TextWriter 的行结束符字符串。
     */
    @checkSetterType(String)
    public set newLine(value: string) {
        let cleanValue = value;
        if (value.trim() === "") {
            cleanValue = this.#initialNewLine;
        }

        this.#coreNewLine = cleanValue.split("");
    }

    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    public abstract get encoding(): Encoding;

    /**
     * 基于所指定的构造参数，初始化 TextWriter 类的新实例。
     */
    public constructor();

    public constructor(...params: any) {
        if (new.target === TextWriter) {
            throw new EvalError("无法创建抽象类“TextWriter”的实例。");
        }

        return TextWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): TextWriter {
        TextWriter[CONSTRUCTOR_SYMBOL] = overload([], function (this: TextWriter) { });
        return TextWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 关闭当前编写器并释放任何与该编写器关联的系统资源。
     */
    public close(): void;

    public close(...params: any): any {
        TextWriter.prototype.close = overload([], function (this: TextWriter): void {
            TextWriter.prototype[Symbol.dispose].apply(this);
        });

        return TextWriter.prototype.close.apply(this, params);
    }

    /**
     * 释放此写入器使用的所有资源。
     */
    public [Symbol.dispose](): void {
        setDisposeStatus(this);
    }

    /**
     * 清理当前编写器的所有缓冲区，使所有缓冲数据写入基础设备。
     */
    public flush(): void;

    public flush(...params: any): any {
        TextWriter.prototype.flush = overload([], function (this: TextWriter): void { });
        return TextWriter.prototype.flush.apply(this, params);
    }

    /**
     * 将字节数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字节数组。
     */
    public write(buffer: Uint8Array): void;

    /**
     * 将字符数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字符数组。
     */
    public write(buffer: Array<string>): void;

    /**
     * 将字符的子数组写入文本字符串或流。
     * @param buffer 要从中写出数据的字符数组。
     * @param index 在开始接收数据时缓存中的字符位置。
     * @param count 要写入的字符数。
     */
    public write(buffer: Array<string>, index: number, count: number): void;

    /**
     * 将 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    public write(value: boolean): void;

    /**
     * 将数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    public write(value: number): void;

    /**
     * 将字符串写入到文本字符串或流。
     * @param value 要写入的字符串。
     */
    public write(value: string): void;

    /**
     * 通过在对象上调用 toString 方法将此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    public write(value: object): void;

    public write(...params: any): any {
        TextWriter.prototype.write = overload()
            .add([Uint8Array], function (this: TextWriter, buffer: Uint8Array): void {
                // 将字节数组转换为字符数组
                const chars = Array.from(buffer, byte => String.fromCharCode(byte));
                this.write(chars, 0, chars.length);
            })
            .add([Array], function (this: TextWriter, buffer: Array<string>): void {
                this.write(buffer, 0, buffer.length);
            })
            .add([[Uint8Array, Array], Number, Number], function (this: TextWriter, buffer: Uint8Array | Array<string>, index: number, count: number): void {
                if (index < 0) {
                    throw new RangeError("“index”不能小于 0。");
                }

                if (count < 0) {
                    throw new RangeError("“count”不能小于 0。");
                }

                if (buffer.length - index < count) {
                    throw new RangeError("缓冲区长度减去索引小于计数。");
                }

                if (buffer instanceof Uint8Array) {
                    for (let i = 0; i < count; i++) {
                        this.write(String.fromCharCode(buffer[index + i]));
                    }
                } else {
                    for (let i = 0; i < count; i++) {
                        this.write(buffer[index + i]);
                    }
                }
            })
            .add([Boolean], function (this: TextWriter, value: boolean): void {
                this.write(value ? "True" : "False");
            })
            .add([Number], function (this: TextWriter, value: number): void {
                this.write(value.toString());
            })
            .add([String], function (this: TextWriter, value: string): void {
                const chars = value.split("");
                this.write(chars, 0, chars.length);
            })
            .add([Object], function (this: TextWriter, value: object): void {
                this.write(value?.toString() ?? "");
            });

        return TextWriter.prototype.write.apply(this, params);
    }

    /**
     * 将行结束符的字符串写入文本字符串或流。
     */
    public writeLine(): void;

    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param value 要写入的字符串。
     */
    public writeLine(value: string): void;

    /**
     * 将后跟行结束符的字符数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     */
    public writeLine(buffer: Array<string>): void;

    /**
     * 将后跟行结束符的字符子数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     * @param index 在开始读取数据时 buffer 中的字符位置。
     * @param count 要写入的最大字符数。
     */
    public writeLine(buffer: Array<string>, index: number, count: number): void;

    /**
     * 将后面带有行结束符的 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    public writeLine(value: boolean): void;

    /**
     * 将后跟行结束符的数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    public writeLine(value: number): void;

    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    public writeLine(value: object): void;

    public writeLine(...params: any): any {
        TextWriter.prototype.writeLine = overload()
            .add([], function (this: TextWriter): void {
                for (const char of this.#coreNewLine) {
                    this.write(char);
                }
            })
            .add([String], function (this: TextWriter, value: string): void {
                const coreNewLine = this.#coreNewLine;
                const vLen = value.length;
                const nlLen = coreNewLine.length;
                const chars = value.split("");

                if (nlLen === 2) {
                    chars[vLen] = coreNewLine[0];
                    chars[vLen + 1] = coreNewLine[1];
                } else if (nlLen === 1) {
                    chars[vLen] = coreNewLine[0];
                } else {
                    for (let i = 0; i < nlLen; i++) {
                        chars[vLen + i] = coreNewLine[i];
                    }
                }

                this.write(chars, 0, vLen + nlLen);
            })
            .add([Array], function (this: TextWriter, buffer: Array<string>): void {
                this.write(buffer);
                this.writeLine();
            })
            .add([Array<string>, Number, Number], function (this: TextWriter, buffer: Array<string>, index: number, count: number): void {
                this.write(buffer, index, count);
                this.writeLine();
            })
            .add([Boolean], function (this: TextWriter, value: boolean): void {
                this.write(value);
                this.writeLine();
            })
            .add([Number], function (this: TextWriter, value: number): void {
                this.write(value);
                this.writeLine();
            })
            .add([Object], function (this: TextWriter, value: object): void {
                this.write(value);
                this.writeLine();
            });

        return TextWriter.prototype.writeLine.apply(this, params);
    }
}

/**
 * 不带任何可写入但无法从中读取的后备存储 TextWriter。
 */
class NullTextWriter extends TextWriter {
    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    public get encoding(): Encoding {
        throw new EvalError("未实现。");
    }

    /**
     * 将字符数组写入该文本字符串或流。
     * @param buffer 要写入文本流中的字符数组。
     */
    public override write(buffer: Array<string>): void;

    /**
     * 将字符的子数组写入文本字符串或流。
     * @param buffer 要从中写出数据的字符数组。
     * @param index 在开始接收数据时缓存中的字符位置。
     * @param count 要写入的字符数。
     */
    public override write(buffer: Array<string>, index: number, count: number): void;

    /**
     * 将 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    public override write(value: boolean): void;

    /**
     * 将数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    public override write(value: number): void;

    /**
     * 将字符串写入到文本字符串或流。
     * @param value 要写入的字符串。
     */
    public override write(value: string): void;

    /**
     * 通过在对象上调用 toString 方法将此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    public override write(value: object): void;

    public override write(...params: any): any {
        NullTextWriter.prototype.write = overload()
            .add([Array, Number, Number], function (this: NullTextWriter, buffer: Array<string>, index: number, count: number): void { })
            .add([String], function (this: NullTextWriter, value: string): void { })
            .any(super.write);

        return NullTextWriter.prototype.write.apply(this, params);
    }

    /**
     * 将行结束符的字符串写入文本字符串或流。
     */
    public override writeLine(): void;

    /**
     * 将后跟行结束符的字符串写入文本字符串或流。
     * @param value 要写入的字符串。
     */
    public override writeLine(value: string): void;

    /**
     * 将后跟行结束符的字符数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     */
    public override writeLine(buffer: Array<string>): void;

    /**
     * 将后跟行结束符的字符子数组写入文本字符串或流。
     * @param buffer 从其读取数据的字符数组。
     * @param index 在开始读取数据时 buffer 中的字符位置。
     * @param count 要写入的最大字符数。
     */
    public override writeLine(buffer: Array<string>, index: number, count: number): void;

    /**
     * 将后面带有行结束符的 Boolean 值的文本表示形式写入文本字符串或流。
     * @param value 要写入的 Boolean 值。
     */
    public override writeLine(value: boolean): void;

    /**
     * 将后跟行结束符的数值的文本表示形式写入文本字符串或流。
     * @param value 要写入的数值。
     */
    public override writeLine(value: number): void;

    /**
     * 通过在对象上调用 toString 方法将后跟行结束符的此对象的文本表示形式写入文本字符串或流。
     * @param value 要写入的对象。
     */
    public override writeLine(value: object): void;

    public override writeLine(...params: any): any {
        NullTextWriter.prototype.writeLine = overload()
            .add([], function (this: NullTextWriter): void { })
            .add([String], function (this: NullTextWriter, value: string): void { })
            .add([Object], function (this: NullTextWriter, value: object): void { })
            .any(super.writeLine);

        return NullTextWriter.prototype.writeLine.apply(this, params);
    }
}
