import overload from "@jyostudio/overload";
import TextWriter from "./textWriter.js";
import { Encoding, StringBuilder } from "@jyostudio/text";
import InternalString from "./internalString.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class StringWriter extends TextWriter {
    #encoding = null;

    #sb = null;

    #isOpen = true;

    get encoding() {
        return this.#encoding;
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        StringWriter[CONSTURCTOR_SYMBOL] = overload()
            .add([], function () {
                return StringWriter[CONSTURCTOR_SYMBOL].call(this, new StringBuilder());
            })
            .add([StringBuilder], function (stringBuilder) {
                this.#sb = stringBuilder;
                this.#encoding = Encoding.unicode;
            });

        return StringWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        return StringWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    close(...params) {
        StringWriter.prototype.close = overload([], function () {
            StringWriter.prototype[Symbol.dispose].apply(this);
        });

        return StringWriter.prototype.close.apply(this, params);
    }

    [Symbol.dispose](...params) {
        const superDispose = super[Symbol.dispose];

        StringWriter.prototype[Symbol.dispose] = overload([], function () {
            this.#encoding = null;
            this.#sb = null;
            this.#isOpen = false;
            superDispose.apply(this, params);

            return true;
        });

        return StringWriter.prototype[Symbol.dispose].apply(this, params);
    }

    getStringBuilder(...params) {
        StringWriter.prototype.getStringBuilder = overload([], function () {
            return this.#sb;
        });

        return StringWriter.prototype.getStringBuilder.apply(this, params);
    }

    toString(...params) {
        StringWriter.prototype.toString = overload([], function () {
            return this.#sb.toString();
        });

        return this.StringWriter.prototype.toString.apply(this, params);
    }

    write(...params) {
        StringWriter.prototype.write = overload()
            .add([InternalString], function (value) {
                const isOpen = this.#isOpen;
                if (!isOpen) {
                    throw new Error("object is closed.");
                }

                this.#sb.append(value);
            })
            .add([Array, Number, Number], function (buffer, index, count) {
                if (index < 0) {
                    throw new RangeError(`"index" must be non-negative.`);
                }

                if (count < 0) {
                    throw new RangeError(`"count" must be non-negative.`);
                }

                if (buffer.Length - index < count) {
                    throw new Error("The buffer is too small.");
                }

                const isOpen = this.#isOpen;
                if (!isOpen) {
                    throw new Error("object is closed.");
                }

                this.#sb.append(buffer, index, count);
            }).any(super.write);

        return StringWriter.prototype.write.apply(this, params);
    }
}
