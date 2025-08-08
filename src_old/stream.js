import overload from "@jyostudio/overload";
import SeekOrigin from "./seekOrigin.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class Stream {
    static #defaultCopyBufferSize = 81920;

    static get null() {
        return new NullStream();
    }

    get canTimeout() {
        return false;
    }

    get canRead() {
        throw new Error("Not implemented.");
    }

    get canSeek() {
        throw new Error("Not implemented.");
    }

    get canWrite() {
        throw new Error("Not implemented.");
    }

    get length() {
        throw new Error("Not implemented.");
    }

    get position() {
        throw new Error("Not implemented.");
    }

    set position(value) {
        throw new Error("Not implemented.");
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        Stream[CONSTURCTOR_SYMBOL] = overload([], function () { });

        return Stream[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        if (new.target === Stream) {
            throw new Error("Stream is an abstract class and cannot be instantiated directly.");
        }

        return Stream[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    #copyTo(destination, bufferSize) {
        const buffer = new Uint8Array(bufferSize);

        let bytesRead = 0;

        while ((bytesRead = this.read(buffer, 0, bufferSize)) > 0) {
            destination.write(buffer, 0, bytesRead);
        }
    }

    copyTo(...params) {
        Stream.prototype.copyTo = overload()
            .add([Stream], function (destination) {
                if (!this.canRead && !this.canWrite) {
                    throw new Error("The stream is closed.");
                }

                if (!destination.canRead && !destination.canWrite) {
                    throw new Error("The destination stream is closed.");
                }

                if (!this.canRead) {
                    throw new Error("The stream does not support reading.");
                }

                if (!destination.canWrite) {
                    throw new Error("The destination stream does not support writing.");
                }

                this.#copyTo(destination, Stream.#defaultCopyBufferSize);
            })
            .add([Stream, Number], function (destination, bufferSize) {
                bufferSize = bufferSize | 0;

                if (bufferSize <= 0) {
                    throw new RangeError("bufferSize");
                }

                if (!this.canRead && !this.canWrite) {
                    throw new Error("The stream is closed.");
                }

                if (!destination.canRead && !destination.canWrite) {
                    throw new Error("The destination stream is closed.");
                }

                if (!this.canRead) {
                    throw new Error("The stream does not support reading.");
                }

                if (!destination.canWrite) {
                    throw new Error("The destination stream does not support writing.");
                }

                this.#copyTo(destination, bufferSize);
            });

        return Stream.prototype.copyTo.apply(this, params);
    }

    close(...params) {
        Stream.prototype.close = overload([], function () { });

        return Stream.prototype.close.apply(this, params);
    }

    flush(...params) {
        Stream.prototype.flush = overload([], function () {
            throw new Error("Not implemented.");
        });

        return Stream.prototype.flush.apply(this, params);
    }

    seek(...params) {
        Stream.prototype.seek = overload([Number, SeekOrigin], function (offset, origin) {
            throw new Error("Not implemented.");
        });

        return Stream.prototype.seek.apply(this, params);
    }

    setLength(...params) {
        Stream.prototype.setLength = overload([Number], function (value) {
            throw new Error("Not implemented.");
        });

        return Stream.prototype.setLength.apply(this, params);
    }

    read(...params) {
        Stream.prototype.read = overload([Uint8Array, Number, Number], function (buffer, offset, count) {
            throw new Error("Not implemented.");
        });

        return Stream.prototype.read.apply(this, params);
    }

    readByte(...params) {
        Stream.prototype.readByte = overload([], function () {
            const oneByteArray = new Uint8Array(1);

            const r = this.read(oneByteArray, 0, 1);

            if (r === 0) {
                return -1;
            }

            return oneByteArray[0];
        });

        return Stream.prototype.readByte.apply(this, params);
    }

    write(...params) {
        Stream.prototype.write = overload([Uint8Array, Number, Number], function (buffer, offset, count) {
            throw new Error("Not implemented.");
        });

        return Stream.prototype.write.apply(this, params);
    }

    writeByte(...params) {
        Stream.prototype.writeByte = overload([Number], function (value) {
            if (value < 0 || value > 255) {
                throw new RangeError("value");
            }

            const oneByteArray = new Uint8Array(1);
            oneByteArray[0] = value;

            this.write(oneByteArray, 0, 1);
        });

        return Stream.prototype.writeByte.apply(this, params);
    }
}

class NullStream extends Stream {
    get canRead() {
        return true;
    }

    get canWrite() {
        return true;
    }

    get canSeek() {
        return true;
    }

    get length() {
        return 0;
    }

    constructor(...params) {
        super(...params);

        Object.defineProperties(this, {
            position: {
                get: () => 0,
                set: overload([Number], function (value) { })
            }
        });
    }

    flush(...params) {
        NullStream.prototype.flush = overload([], function () { }).any(super.flush);

        return NullStream.prototype.flush.apply(this, params);
    }

    read(...params) {
        NullStream.prototype.read = overload([Uint8Array, Number, Number], function (buffer, offset, count) {
            return 0;
        }).any(super.read);

        return NullStream.prototype.read.apply(this, params);
    }

    readByte(...params) {
        NullStream.prototype.readByte = overload([], function () {
            return -1;
        }).any(super.readByte);

        return NullStream.prototype.readByte.apply(this, params);
    }

    write(...params) {
        NullStream.prototype.write = overload([Uint8Array, Number, Number], function (buffer, offset, count) { }).any(super.write);

        return NullStream.prototype.write.apply(this, params);
    }

    writeByte(...params) {
        NullStream.prototype.writeByte = overload([Number], function (value) { }).any(super.writeByte);

        return NullStream.prototype.writeByte.apply(this, params);
    }

    seek(...params) {
        NullStream.prototype.seek = overload([Number, SeekOrigin], function (offset, origin) {
            return 0;
        }).any(super.seek);

        return NullStream.prototype.seek.apply(this, params);
    }

    setLength(...params) {
        NullStream.prototype.setLength = overload([Number], function (value) { }).any(super.setLength);

        return NullStream.prototype.setLength.apply(this, params);
    }
}