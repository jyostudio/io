import overload from "@jyostudio/overload";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class TextReader {
    static get null() {
        return new NullTextReader();
    }

    #isDisposed = false;

    static [CONSTURCTOR_SYMBOL](...params) {
        TextReader[CONSTURCTOR_SYMBOL] = overload([], function () { });

        return TextReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        if (new.target === TextReader) {
            throw new Error("TextReader is an abstract class and cannot be instantiated directly.");
        }

        return TextReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    #checkDisposed() {
        if (this.#isDisposed) throw new Error("Object is disposed.");
    }

    close(...params) {
        TextReader.prototype.close = overload([], function () {
            TextReader.prototype[Symbol.dispose].apply(this);
        });

        return TextReader.prototype.close.apply(this, params);
    }

    [Symbol.dispose](...params) {
        TextReader.prototype[Symbol.dispose] = overload([], function () {
            if (this.#isDisposed) return true;
            this.#isDisposed = true;

            this.close();

            return true;
        });

        return TextReader.prototype[Symbol.dispose].apply(this, params);
    }

    peek(...params) {
        TextReader.prototype.peek = overload()
            .add([], function () {
                this.#checkDisposed();

                return -1;
            });

        return TextReader.prototype.peek.apply(this, params);
    }

    read(...params) {
        TextReader.prototype.read = overload()
            .add([], function () {
                this.#checkDisposed();

                return -1;
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

    readToEnd(...params) {
        TextReader.prototype.readToEnd = overload()
            .add([], function () {
                this.#checkDisposed();

                let sb = [];
                let chars = new Array(4096);
                let len = 0;
                while ((len = this.read(chars, 0, chars.length)) != 0) {
                    sb = sb.concat(chars);
                }

                return sb.join('');
            });

        return TextReader.prototype.readToEnd.apply(this, params);
    }

    readBlock(...params) {
        TextReader.prototype.readBlock = overload()
            .add([Array, Number, Number], function (buffer, index, count) {
                this.#checkDisposed();

                let i = 0;
                let n = 0;
                do {
                    n += (i = this.read(buffer, index + n, count - n));
                } while (i > 0 && n < count);

                return n;
            });

        return TextReader.prototype.readBlock.apply(this, params);
    }

    readLine(...params) {
        TextReader.prototype.readLine = overload()
            .add([], function () {
                this.#checkDisposed();

                let sb = [];
                while (true) {
                    let ch = this.read();

                    if (ch === -1) {
                        break;
                    }

                    if (ch === '\r'.charCodeAt() || ch === '\n'.charCodeAt()) {
                        if (ch === '\r'.charCodeAt() && this.peek() === '\n'.charCodeAt()) {
                            this.read();
                        }

                        return sb.join('');
                    }

                    sb.push(String.fromCharCode(ch));
                }
            });

        return TextReader.prototype.readLine.apply(this, params);
    }
}


class NullTextReader extends TextReader {
    #isDisposed = false;

    #checkDisposed() {
        if (this.#isDisposed) throw new Error("Object is disposed.");
    }

    close(...params) {
        const superClose = super.close;
        NullTextReader.prototype.close = overload().any(function () {
            this.#isDisposed = true;
            superClose.apply(this);
        });

        return NullTextReader.prototype.close.apply(this, params);
    }

    read(...params) {
        NullTextReader.prototype.read = overload()
            .add([], function () {
                this.#checkDisposed();

                return -1;
            })
            .add([Array, Number, Number], function (buffer, index, count) {
                this.#checkDisposed();

                return 0;
            })
            .any(super.read);

        return NullTextReader.prototype.read.apply(this, params);
    }

    readLine(...params) {
        NullTextReader.prototype.readLine = overload([], function () {
            this.#checkDisposed();

            return "";
        }).any(super.readLine);

        return NullTextReader.prototype.readLine.apply(this, params);
    }
}
