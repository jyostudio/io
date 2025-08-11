import overload from "@jyostudio/overload";

const CONSTRUCTOR_SYMBOL = Symbol("constructor");

/**
 * 表示可读取有序字符系列的读取器。
 */
export default abstract class TextReader {
    /**
     * 指定无数据可供读取的 TextReader。
     */
    static #null: NullTextReader | null = null;

    /**
     * 提供一个无数据可供读取的 TextReader。
     * @returns 无数据可供读取的 TextReader。
     */
    static get null(): NullTextReader {
        return this.#null ??= new NullTextReader();
    }

    /**
     * 基于所指定的构造参数，初始化 TextReader 类的新实例。
     */
    public constructor();

    public constructor(...params: any) {
        if (new.target === TextReader) {
            throw new EvalError("无法创建抽象类“TextReader”的实例。");
        }

        return TextReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    private static [CONSTRUCTOR_SYMBOL](...params: any): TextReader {
        TextReader[CONSTRUCTOR_SYMBOL] = overload([], function (this: TextReader) { });
        return TextReader[CONSTRUCTOR_SYMBOL].apply(this, params);
    }

    /**
     * 关闭 TextReader 并释放与该 TextReader 关联的所有系统资源。
     */
    public close(): void;

    public close(...params: any): any {
        TextReader.prototype.close = overload([], function (this: TextReader): void {
            TextReader.prototype[Symbol.dispose].apply(this);
        });

        return TextReader.prototype.close.apply(this, params);
    }

    /**
     * 释放此读取器使用的所有资源。
     */
    public [Symbol.dispose](): void {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            try {
                if (key === "constructor") continue;
                if (typeof (this as any)[key] === "function") {
                    (this as any)[key] = () => {
                        throw new Error("TextReader 实例已被释放，无法调用方法。");
                    };
                } else if (key !== "constructor") {
                    Object.defineProperty(this, key, {
                        get: () => {
                            throw new Error("TextReader 实例已被释放，无法访问属性。");
                        },
                        set: () => {
                            throw new Error("TextReader 实例已被释放，无法设置属性。");
                        }
                    });
                }
            } catch { }
        }
    }

    /**
     * 读取下一个字符，而不更改读取器状态或字符源。返回下一个可用字符，而实际上并不从读取器中读取此字符。
     * @returns 一个表示下一个要读取的字符的整数；如果没有更多可读取的字符或该读取器不支持查找，则为 -1。
     */
    public peek(): number;

    public peek(...params: any): any {
        TextReader.prototype.peek = overload([], function (this: TextReader): number {
            return -1;
        });

        return TextReader.prototype.peek.apply(this, params);
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
        TextReader.prototype.read = overload()
            .add([], function (this: TextReader): number {
                return -1;
            })
            .add([Array, Number, Number], function (this: TextReader, buffer: string[], index: number, count: number): number {
                if (index < 0) {
                    throw new RangeError("“index”不能小于 0。");
                }

                if (count < 0) {
                    throw new RangeError("“count”不能小于 0。");
                }

                if (buffer.length - index < count) {
                    throw new RangeError(`缓冲区长度减去索引小于计数。`);
                }

                let n = 0;
                do {
                    let ch = this.read();
                    if (ch === -1) {
                        break;
                    }
                    buffer[index + n++] = String.fromCharCode(ch);
                } while (n < count);

                return n;
            });

        return TextReader.prototype.read.apply(this, params);
    }

    /**
     * 读取从当前位置到文本读取器末尾的所有字符并将它们作为一个字符串返回。
     * @returns 一个包含从当前位置到文本读取器末尾的所有字符的字符串。
     */
    public readToEnd(): string;

    public readToEnd(...params: any): any {
        TextReader.prototype.readToEnd = overload([], function (this: TextReader): string {
            let sb: string[] = [];
            let chars = new Array<string>(4096);
            let len = 0;
            while ((len = this.read(chars, 0, chars.length)) !== 0) {
                sb = sb.concat(chars.slice(0, len));
            }

            return sb.join('');
        });

        return TextReader.prototype.readToEnd.apply(this, params);
    }

    /**
     * 从当前文本读取器中读取指定的最大字符数并从指定索引处开始将该数据写入缓冲区。
     * @param buffer 此方法返回时，此参数包含指定的字符数组，该数组中从 index 到 (index + count -1) 之间的值由从当前源中读取的字符替换。
     * @param index 在 buffer 中开始写入的位置。
     * @param count 要读取的最大字符数。
     * @returns 已读取的字符数。该数字将小于或等于 count，取决于是否所有的输入字符都已读取。
     */
    public readBlock(buffer: string[], index: number, count: number): number;

    public readBlock(...params: any): any {
        TextReader.prototype.readBlock = overload([Array, Number, Number], function (this: TextReader, buffer: string[], index: number, count: number): number {
            let i = 0;
            let n = 0;
            do {
                n += (i = this.read(buffer, index + n, count - n));
            } while (i > 0 && n < count);

            return n;
        });

        return TextReader.prototype.readBlock.apply(this, params);
    }

    /**
     * 从文本读取器中读取一行字符并将数据作为字符串返回。
     * @returns 读取器中的下一行，或 null（如果已读取所有字符）。
     */
    public readLine(): string | null;

    public readLine(...params: any): any {
        TextReader.prototype.readLine = overload([], function (this: TextReader): string | null {
            let sb: string[] = [];
            while (true) {
                let ch = this.read();

                if (ch === -1) {
                    if (sb.length === 0) {
                        return null;
                    }
                    break;
                }

                if (ch === "\r".charCodeAt(0) || ch === "\n".charCodeAt(0)) {
                    if (ch === "\r".charCodeAt(0) && this.peek() === "\n".charCodeAt(0)) {
                        this.read();
                    }

                    return sb.join("");
                }

                sb.push(String.fromCharCode(ch));
            }

            return sb.join("");
        });

        return TextReader.prototype.readLine.apply(this, params);
    }
}

/**
 * 无数据可供读取的 TextReader。
 */
class NullTextReader extends TextReader {
    /**
     * 关闭 NullTextReader 并释放与该读取器关联的所有系统资源。
     */
    public close(): void;

    public close(...params: any): any {
        const superClose = super.close;
        NullTextReader.prototype.close = overload([], function (this: NullTextReader): void {
            superClose.apply(this);
        });

        return NullTextReader.prototype.close.apply(this, params);
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
     * @param count 要读取的最大字符数。
     * @returns 已读取的字符数。
     */
    public read(buffer: string[], index: number, count: number): number;

    public read(...params: any): any {
        NullTextReader.prototype.read = overload()
            .add([], function (this: NullTextReader): number {
                return -1;
            })
            .add([Array, Number, Number], function (this: NullTextReader, buffer: string[], index: number, count: number): number {
                return -1;
            });

        return NullTextReader.prototype.read.apply(this, params);
    }

    /**
     * 从文本读取器中读取一行字符并将数据作为字符串返回。
     * @returns 空字符串。
     */
    public readLine(): string | null;

    public readLine(...params: any): any {
        NullTextReader.prototype.readLine = overload([], function (this: NullTextReader): string {
            return "";
        });

        return NullTextReader.prototype.readLine.apply(this, params);
    }
}