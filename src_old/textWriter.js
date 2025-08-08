import overload from "@jyostudio/overload";
import Buffer from "./buffer.js";
import InternalString from "./internalString.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class TextWriter {
    static get null() {
        return new NullTextWriter();
    }

    #initialNewLine = "\r\n";

    #coreNewLine = ['\r', '\n'];

    #isDisposed = false;

    get encoding() {
        throw new Error("Not implemented.");
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        TextWriter[CONSTURCTOR_SYMBOL] = overload([], function () { });

        return TextWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        if (new.target === TextWriter) {
            throw new Error("TextWriter is an abstract class and cannot be instantiated directly.");
        }

        Object.defineProperties(this, {
            newLine: {
                get() {
                    return JSON.parse(JSON.stringify(this.#coreNewLine));
                },
                set: overload([String], function (value) {
                    if (value.trim() === "") {
                        value = this.#initialNewLine;
                    }

                    [...this.#coreNewLine] = value.split("");
                })
            }
        });

        return TextWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    close(...params) {
        TextWriter.prototype.close = overload([], function () {
            TextWriter.prototype[Symbol.dispose].apply(this);
        });

        return TextWriter.prototype.close.apply(this, params);
    }

    [Symbol.dispose](...params) {
        TextWriter.prototype[Symbol.dispose] = overload([], function () {
            if (this.#isDisposed) return true;
            this.#isDisposed = true;

            this.close();

            return true;
        });

        return TextWriter.prototype[Symbol.dispose].apply(this, params);
    }

    flush(...params) {
        TextWriter.prototype.flush = overload([], function () { });

        return TextWriter.prototype.flush.apply(this, params);
    }

    write(...params) {
        TextWriter.prototype.write = overload()
            .add([[Uint8Array, Array]], function (buffer) {
                this.write(buffer, 0, buffer.length);
            })
            .add([[Uint8Array, Array], Number, Number], function (buffer, index, count) {
                if (index < 0) {
                    throw new RangeError(`"index" must be non-negative.`);
                }

                if (count < 0) {
                    throw new RangeError(`"count" must be non-negative.`);
                }

                if (buffer.length - index < count) {
                    throw new Error("The buffer is too small.");
                }

                for (let i = 0; i < count; i++) {
                    this.write(new InternalString(buffer[index + i]));
                }
            })
            .add([Boolean], function (value) {
                this.write(!!value ? "True" : "False");
            })
            .add([Number], function (value) {
                this.write(value.toString());
            })
            .add([String], function (value) {
                this.write(value.split(''));
            })
            .add([Object], function (value) {
                this.write(value.toString());
            });

        return TextWriter.prototype.write.apply(this, params);
    }

    writeLine(...params) {
        TextWriter.prototype.writeLine = overload()
            .add([], function () {
                this.write(this.#coreNewLine);
            })
            .add([String], function (value) {
                const coreNewLine = this.#coreNewLine;

                const vLen = value.length;
                const nlLen = coreNewLine.length;
                let chars = value.split('');
                if (nlLen == 2) {
                    chars[vLen] = coreNewLine[0];
                    chars[vLen + 1] = coreNewLine[1];
                } else if (nlLen == 1) {
                    chars[vLen] = coreNewLine[0];
                } else {
                    Buffer.blockCopy(coreNewLine, 0, chars, vLen, nlLen);
                }

                this.write(chars, 0, vLen + nlLen);
            })
            .add([[Uint8Array, Array]], function (buffer) {
                this.write(buffer);
                this.writeLine();
            })
            .add([[Uint8Array, Array], Number, Number], function (buffer, index, count) {
                this.write(buffer, index, count);
                this.writeLine();
            })
            .add([Boolean], function (value) {
                this.write(value);
                this.writeLine();
            })
            .add([Number], function (value) {
                this.write(value);
                this.writeLine();
            })
            .add([Object], function (value) {
                this.write(value);
                this.writeLine();
            });

        return TextWriter.prototype.writeLine.apply(this, params);
    }
}

class NullTextWriter extends TextWriter {
    write(...params) {
        NullTextWriter.prototype.write = overload()
            .add([[Uint8Array, Array], Number, Number], function (buffer, index, count) { })
            .add([String], function () { })
            .any(super.write);

        return NullTextWriter.prototype.write.apply(this, params);
    }

    writeLine(...params) {
        NullTextWriter.prototype.writeLine = overload()
            .add([], function () { })
            .add([String], function (value) { })
            .add([Object], function (value) { })
            .any(super.writeLine);

        return NullTextWriter.prototype.writeLine.apply(this, params);
    }
}
