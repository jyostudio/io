import overload from "@jyostudio/overload";
import TextReader from "./textReader.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class StringReader extends TextReader {
    #_s = "";

    #_pos = 0;

    #_length = 0;

    #isDisposed = false;

    static [CONSTURCTOR_SYMBOL](...params) {
        StringReader[CONSTURCTOR_SYMBOL] = overload([String], function (s) {
            this.#_s = s;
            this.#_length = s.length;
        });

        return StringReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        super();

        return StringReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    #checkDisposed() {
        if (this.#isDisposed) throw new Error("Object is disposed.");
    }

    close(...params) {
        StringReader.prototype.Close = overload([], function () {
            StringReader.prototype[Symbol.dispose].apply(this);
        });

        return StringReader.prototype.Close.call(this, ...params);
    }

    [Symbol.dispose](...params) {
        const superDispose = super[Symbol.dispose];
        StringReader.prototype[Symbol.dispose] = overload([], function () {
            if (this.#isDisposed) return true;
            this.#isDisposed = true;

            superDispose.call(this, ...params);

            this.#_s = "";
            this.#_pos = 0;
            this.#_length = 0;

            this.close();

            return true;
        });

        return StringReader.prototype[Symbol.dispose].apply(this, params);
    }

    peek(...params) {
        StringReader.prototype.peek = overload([], function () {
            this.#checkDisposed();

            let pos = this.#_pos;
            let length = this.#_length;

            if (pos === length) {
                return -1;
            }

            return this.#_s[pos];
        }).any(super.peek);

        return StringReader.prototype.peek.call(this, ...params);
    }

    read(...params) {
        StringReader.prototype.read = overload()
            .add([], function () {
                this.#checkDisposed();

                let pos = this.#_pos;
                let length = this.#_length;

                if (pos === length) {
                    return -1;
                }

                return this.#_s[this.#_pos++];
            })
            .add([Array, Number, Number], function (buffer, index, count) {
                this.#checkDisposed();

                if (index < 0) {
                    throw new RangeError(`"index" must be non-negative.`);
                }

                if (count < 0) {
                    throw new RangeError(`"count" must be non-negative.`);
                }

                if (buffer.length - index < count) {
                    throw new Error("The buffer length minus index is less than count.");
                }

                let n = this.#_length - this.#_pos;
                if (n > 0) {
                    if (n > count) {
                        n = count;
                    }

                    let strs = this.#_s.split('');

                    for (let i = 0; i < count; i++) {
                        buffer[index + i] = strs[this.#_pos + i];
                    }

                    this.#_pos += n;
                }

                return n;
            })
            .any(super.read);

        return StringReader.prototype.read.call(this, ...params);
    }

    readToEnd(...params) {
        StringReader.prototype.readToEnd = overload([], function () {
            this.#checkDisposed();

            let s = "";

            let pos = this.#_pos;

            if (pos === 0) {
                s = this.#_s;
            } else {
                s = this.#_s.substr(pos, this.#_length - pos);
            }

            this.#_pos = this.#_length;

            return s;
        }).any(super.readToEnd);

        return StringReader.prototype.readToEnd.call(this, ...params);
    }

    readLine(...params) {
        StringReader.prototype.readLine = overload([], function () {
            this.#checkDisposed();

            let str = this.#_s;
            let i = this.#_pos;
            let pos = this.#_pos;
            let length = this.#_length;

            while (i < length) {
                let ch = str[i].charCodeAt();
                if (ch === "\r".charCodeAt() || ch === "\n".charCodeAt()) {
                    let result = str.substr(pos, i - pos);

                    pos = this.#_pos = i + 1;

                    if (ch === "\r".charCodeAt() && pos < length && str[pos].charCodeAt() === "\n".charCodeAt()) {
                        pos = this.#_pos++;
                    }

                    return result;
                }

                i++;
            }

            if (i > pos) {
                let result = str.substr(pos, i - pos);
                pos = this.#_pos = i;
                return result;
            }

            return null;
        }).any(super.readLine);

        return StringReader.prototype.readLine.call(this, ...params);
    }
}
