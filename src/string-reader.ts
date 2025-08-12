import overload from "@jyostudio/overload";
import TextReader from "./text-reader";
import { setDisposeStatus } from "./_utils";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 实现从字符串读取的 TextReader。
 */
export default class StringReader extends TextReader {
    /**
     * 要读取的字符串。
     */
    #string: string = "";

    /**
     * 当前位置。
     */
    #position: number = 0;

    /**
     * 字符串长度。
     */
    #length: number = 0;

    /**
     * 基于指定的字符串初始化 StringReader 类的新实例。
     * @param s StringReader 应从其中进行初始化的字符串。
     */
    public constructor(s: string);

    public constructor(...params: any) {
        super();
        return StringReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): StringReader {
        StringReader[CONSTRUCTOR_SYMBOL] = overload([String], function (this: StringReader, s: string) {
            this.#string = s;
            this.#length = s.length;
        });

        return StringReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 关闭 StringReader 并释放与该 StringReader 关联的所有系统资源。
     */
    public close(): void;

    public close(...params: any): any {
        StringReader.prototype.close = overload([], function (this: StringReader): void {
            StringReader.prototype[Symbol.dispose].apply(this);
        });

        return StringReader.prototype.close.apply(this, params);
    }

    /**
     * 释放此字符串读取器使用的所有资源。
     */
    public [Symbol.dispose](): void {
        this.#string = "";
        this.#position = 0;
        this.#length = 0;

        setDisposeStatus(this);
    }

    /**
     * 读取下一个字符，而不更改读取器状态或字符源。返回下一个可用字符，而实际上并不从读取器中读取此字符。
     * @returns 一个表示下一个要读取的字符的整数；如果没有更多可读取的字符或该读取器不支持查找，则为 -1。
     */
    public peek(): number;

    public peek(...params: any): any {
        const superPeek = super.peek;
        StringReader.prototype.peek = overload([], function (this: StringReader): number {
            if (this.#position === this.#length) {
                return -1;
            }

            return this.#string.charCodeAt(this.#position);
        }).any(superPeek);

        return StringReader.prototype.peek.apply(this, params);
    }

    /**
     * 读取文本读取器中的下一个字符并使该字符的位置前移一个字符。
     * @returns 文本读取器中的下一个字符，或为 -1（如果没有更多可用字符）。
     */
    public read(): number;

    /**
     * 从当前读取器中读取指定数目的字符并从指定索引开始将该数据写入缓冲区。
     * @param buffer 此方法返回时，包含指定的字符数组，该数组的 index 和 (index + count - 1) 之间的值由从当前源中读取的字符替换。
     * @param index 在 buffer 中开始写入的位置。
     * @param count 要读取的最大字符数。如果在将指定数量的字符读入缓冲区之前就已达读取器的末尾，则返回该方法。
     * @returns 已读取的字符数。该数会小于或等于 count，具体取决于读取器中是否有可用的数据。如果调用此方法时没有留下更多的字符供读取，则此方法返回 0（零）。
     */
    public read(buffer: string[], index: number, count: number): number;

    public read(...params: any): any {
        const superRead = super.read;
        StringReader.prototype.read = overload()
            .add([], function (this: StringReader): number {
                if (this.#position === this.#length) {
                    return -1;
                }

                return this.#string.charCodeAt(this.#position++);
            })
            .add([Array, Number, Number], function (this: StringReader, buffer: string[], index: number, count: number): number {
                if (index < 0) {
                    throw new RangeError("“index”不能小于 0。");
                }

                if (count < 0) {
                    throw new RangeError("“count”不能小于 0。");
                }

                if (buffer.length - index < count) {
                    throw new RangeError("缓冲区长度减去索引小于计数。");
                }

                let n = this.#length - this.#position;
                if (n > 0) {
                    if (n > count) {
                        n = count;
                    }

                    for (let i = 0; i < n; i++) {
                        buffer[index + i] = this.#string.charAt(this.#position + i);
                    }

                    this.#position += n;
                }

                return n;
            })
            .any(superRead);

        return StringReader.prototype.read.apply(this, params);
    }

    /**
     * 读取从当前位置到文本读取器末尾的所有字符并将它们作为一个字符串返回。
     * @returns 一个包含从当前位置到文本读取器末尾的所有字符的字符串。
     */
    public readToEnd(): string;

    public readToEnd(...params: any): any {
        const superReadToEnd = super.readToEnd;
        StringReader.prototype.readToEnd = overload([], function (this: StringReader): string {
            let result = "";

            if (this.#position === 0) {
                result = this.#string;
            } else {
                result = this.#string.substring(this.#position, this.#length);
            }

            this.#position = this.#length;

            return result;
        }).any(superReadToEnd);

        return StringReader.prototype.readToEnd.apply(this, params);
    }

    /**
     * 从文本读取器中读取一行字符并将数据作为字符串返回。
     * @returns 读取器中的下一行，或 null（如果已读取所有字符）。
     */
    public readLine(): string | null;

    public readLine(...params: any): any {
        const superReadLine = super.readLine;
        StringReader.prototype.readLine = overload([], function (this: StringReader): string | null {
            const str = this.#string;
            let i = this.#position;
            const length = this.#length;

            while (i < length) {
                const ch = str.charCodeAt(i);
                if (ch === "\r".charCodeAt(0) || ch === "\n".charCodeAt(0)) {
                    const result = str.substring(this.#position, i);
                    this.#position = i + 1;

                    if (ch === "\r".charCodeAt(0) && this.#position < length && str.charCodeAt(this.#position) === "\n".charCodeAt(0)) {
                        this.#position++;
                    }

                    return result;
                }

                i++;
            }

            if (i > this.#position) {
                const result = str.substring(this.#position, i);
                this.#position = i;
                return result;
            }

            return null;
        }).any(superReadLine);

        return StringReader.prototype.readLine.apply(this, params);
    }
}
