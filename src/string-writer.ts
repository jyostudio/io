import overload from "@jyostudio/overload";
import { Encoding, StringBuilder } from "@jyostudio/text";
import { setDisposeStatus } from "./_utils";
import TextWriter from "./text-writer";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 实现 TextWriter 用于将字符写入到字符串中。
 */
export default class StringWriter extends TextWriter {
    /**
     * 字符编码。
     */
    #encoding: Encoding | null = null;

    /**
     * 字符串构建器。
     */
    #stringBuilder: StringBuilder | null = null;

    /**
     * 当在派生类中重写时，返回用来写输出的该字符编码。
     * @returns 用来写入输出的字符编码。
     */
    public get encoding(): Encoding {
        return this.#encoding!;
    }

    /**
     * 初始化 StringWriter 类的新实例，使用默认的 StringBuilder。
     */
    public constructor();

    /**
     * 使用指定的 StringBuilder 初始化 StringWriter 类的新实例。
     * @param sb 要写入的 StringBuilder。
     */
    public constructor(sb: StringBuilder);

    public constructor(...params: any) {
        super();
        return StringWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): StringWriter {
        StringWriter[CONSTRUCTOR_SYMBOL] = overload()
            .add([], function (this: StringWriter) {
                return StringWriter[CONSTRUCTOR_SYMBOL].call(this, new StringBuilder());
            })
            .add([StringBuilder], function (this: StringWriter, sb: StringBuilder) {
                this.#stringBuilder = sb;
                this.#encoding = Encoding.unicode;
            });

        return StringWriter[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 关闭当前 StringWriter 并释放任何与该 StringWriter 关联的系统资源。
     */
    public close(): void;

    public close(...params: any): any {
        StringWriter.prototype.close = overload([], function (this: StringWriter): void {
            StringWriter.prototype[Symbol.dispose].apply(this);
        });

        return StringWriter.prototype.close.apply(this, params);
    }

    /**
     * 释放此字符串写入器使用的所有资源。
     */
    public [Symbol.dispose](): void {
        this.#encoding = null;
        this.#stringBuilder = null;

        setDisposeStatus(this);
    }

    /**
     * 返回此 StringWriter 写入的基础 StringBuilder。
     * @returns 基础 StringBuilder。
     */
    public getStringBuilder(): StringBuilder;

    public getStringBuilder(...params: any): any {
        StringWriter.prototype.getStringBuilder = overload([], function (this: StringWriter): StringBuilder {
            return this.#stringBuilder!;
        });

        return StringWriter.prototype.getStringBuilder.apply(this, params);
    }

    /**
     * 返回包含到此为止写入当前 StringWriter 的字符的字符串。
     * @returns 包含到此为止写入当前 StringWriter 的字符的字符串。
     */
    public toString(): string;

    public toString(...params: any): any {
        StringWriter.prototype.toString = overload([], function (this: StringWriter): string {
            return this.#stringBuilder!.toString();
        });

        return StringWriter.prototype.toString.apply(this, params);
    }

    public write(...params: any): any {
        StringWriter.prototype.write = overload()
            .add([String], function (this: StringWriter, value: string): void {
                this.#stringBuilder!.append(value);
            })
            .add([Array, Number, Number], function (this: StringWriter, buffer: Array<string>, index: number, count: number): void {
                if (index < 0) {
                    throw new RangeError("“index”不能小于 0。");
                }

                if (count < 0) {
                    throw new RangeError("“count”不能小于 0。");
                }

                if (buffer.length - index < count) {
                    throw new RangeError("缓冲区长度减去索引小于计数。");
                }

                this.#stringBuilder!.append(buffer, index, count);
            })
            .any(super.write);

        return StringWriter.prototype.write.apply(this, params);
    }
}
