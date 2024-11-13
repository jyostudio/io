import overload from "@jyostudio/overload";
import { Encoding, UTF8Encoding } from "@jyostudio/text";
import Stream from "./stream.js";
import Buffer from "./buffer.js";
import SeekOrigin from "./seekOrigin.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class BinaryReader {
    #stream;

    #encoding;

    #buffer;

    #view;

    #charBytes;

    #bigEndian = false;

    set bigEndian(value) {
        this.#bigEndian = value;
    }

    get baseStream() {
        return this.#stream;
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        BinaryReader[CONSTURCTOR_SYMBOL] = overload()
            .add([Stream], function (input) {
                return BinaryReader[CONSTURCTOR_SYMBOL].call(this, input, new UTF8Encoding(), false);
            })
            .add([Stream, Encoding], function (input, encoding) {
                return BinaryReader[CONSTURCTOR_SYMBOL].call(this, input, encoding, false);
            })
            .add([Stream, Encoding, Boolean], function (input, encoding, bigEndian) {
                if (!input.canRead) throw new EvalError("The stream does not support reading.");

                this.#stream = input;
                this.#encoding = encoding;
                this.#bigEndian = bigEndian;
                this.#buffer = new Uint8Array(input.length);
                this.#view = new DataView(this.#buffer.buffer);
                this.#charBytes = new Uint8Array(12);
            });

        return BinaryReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        return BinaryReader[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    fillBuffer(...params) {
        BinaryReader.prototype.fillBuffer = overload([Number], function (numBytes) {
            const buffer = this.#buffer;
            if (numBytes < 0 || numBytes > buffer.byteLength) {
                throw new RangeError("numBytes is out of range.");
            }

            let bytesRead = 0;
            let n = 0;

            if (numBytes === 1) {
                n = this.#stream.readByte();
                if (n === -1) throw new RangeError("End of stream.");
                this.#buffer[0] = n;
                return;
            }

            do {
                n = this.#stream.read(this.#buffer, bytesRead, numBytes - bytesRead);
                if (n === 0) throw new RangeError("End of stream.");
                bytesRead += n;
            } while (bytesRead < numBytes);
        });

        return BinaryReader.prototype.fillBuffer.apply(this, params);
    }

    close(...params) {
        BinaryReader.prototype.close = overload([], function () {
            BinaryReader.prototype[Symbol.dispose].apply(this);
        });

        return BinaryReader.prototype.close.apply(this, params);
    }

    [Symbol.dispose](...params) {
        BinaryReader.prototype[Symbol.dispose] = overload([], function () {
            this.#stream.close();
            this.#stream = null;
            this.#encoding = null;
            this.#buffer = null;
            this.#view = null;
            this.#charBytes = null;
        });

        return BinaryReader.prototype[Symbol.dispose].apply(this, params);
    }

    peekChar(...params) {
        BinaryReader.prototype.peekChar = overload([], function () {
            if (!this.#stream.canSeek) return -1;

            const origPos = this.#stream.position;
            const ch = this.read();
            this.#stream.position = origPos;
            return ch;
        });

        return BinaryReader.prototype.peekChar.apply(this, params);
    }

    read(...params) {
        BinaryReader.prototype.read = overload()
            .add([], function () {
                const length = 1;
                const encoding = this.#encoding;
                if (encoding instanceof UTF8Encoding) {
                    let charBytes = this.#charBytes;
                    let hasBytesCount = 0;
                    charBytes[0] = this.#stream.readByte();
                    let r = charBytes[0].toString(2).padStart(8, "0");
                    for (let i = 0; i < r.length; i++) {
                        if (r[i] === "1" && i === hasBytesCount) hasBytesCount++;
                        else break;
                    }
                    if (hasBytesCount) hasBytesCount--;
                    for (let i = 0; i < hasBytesCount; i++) {
                        charBytes[i + 1] = this.#stream.readByte();
                    }
                    return encoding.getString(charBytes, 0, hasBytesCount + 1).charCodeAt();
                }

                const charBytes = new Uint8Array(length);

                for (let i = 0; i < length; i++) {
                    let r = this.#stream.readByte();
                    charBytes[i] = r;
                }

                return encoding.getString(charBytes).charCodeAt();
            })
            .add([Uint8Array, Number, Number], function (buffer, index, count) {
                if (index < 0) {
                    throw new RangeError("index is out of range.");
                }

                if (count < 0) {
                    throw new RangeError("count is out of range.");
                }

                if (buffer.byteLength - index < count) {
                    throw new Error("The buffer is too small.");
                }

                return this.#stream.read(buffer, index, count);
            })
            .add([Array, Number, Number], function (buffer, index, count) {
                for (let i = 0; i < count; i++) {
                    buffer[index + i] = this.readChar();
                }

                return count;
            });

        return BinaryReader.prototype.read.apply(this, params);
    }

    read7BitEncodedInt(...params) {
        BinaryReader.prototype.read7BitEncodedInt = overload([], function () {
            let count = 0;
            let shift = 0;
            let b;

            do {
                if (shift === 5 * 7) throw new SyntaxError("Invalid 7-bit encoded integer.");

                b = this.readByte();
                count |= (b & 0x7F) << shift;
                shift += 7;
            } while ((b & 0x80) !== 0);

            return count;
        });

        return BinaryReader.prototype.read7BitEncodedInt.apply(this, params);
    }

    readBoolean(...params) {
        BinaryReader.prototype.readBoolean = overload([], function () {
            this.fillBuffer.call(this, 1);
            return this.#buffer[0] !== 0;
        });

        return BinaryReader.prototype.readBoolean.apply(this, params);
    }

    readByte(...params) {
        BinaryReader.prototype.readByte = overload([], function () {
            let b = this.#stream.readByte();
            if (b === -1) throw new Error("End of stream.");
            return b;
        });

        return BinaryReader.prototype.readByte.apply(this, params);
    }

    readBytes(...params) {
        BinaryReader.prototype.readBytes = overload([Number], function (count) {
            if (count === 0) return [];

            let result = new Uint8Array(count);
            let numRead = 0;

            do {
                const n = this.#stream.read(result, numRead, count);
                if (n === 0) break;
                numRead += n;
                count -= n;
            } while (count > 0);

            if (numRead != result.length) {
                const copy = new Uint8Array(numRead);
                Buffer.blockCopy(result, 0, copy, 0, numRead);
                result = copy;
            }

            return result;
        });

        return BinaryReader.prototype.readBytes.apply(this, params);
    }

    readChar(...params) {
        BinaryReader.prototype.readChar = overload([], function () {
            const value = this.read();
            if (value === -1) throw new Error("End of stream.");
            return String.fromCharCode(value);
        });

        return BinaryReader.prototype.readChar.apply(this, params);
    }

    readChars(...params) {
        BinaryReader.prototype.readChars = overload([Number], function (count) {
            const chars = [];
            for (let i = 0; i < count; i++) {
                chars[i] = this.readChar();
            }
            return chars;
        });

        return BinaryReader.prototype.readChars.apply(this, params);
    }

    readS15Fixed16(...params) {
        BinaryReader.prototype.readS15Fixed16 = overload([], function () {
            if (!this.#bigEndian) {
                const d = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                const res = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                return (res + d / 65536);
            } else {
                const res = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                const d = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                return (res + d / 65536);
            }
        });

        return BinaryReader.prototype.readS15Fixed16.apply(this, params);
    }

    readFixed(...params) {
        BinaryReader.prototype.readFixed = overload([], function () {
            if (!this.#bigEndian) {
                const d = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                const res = (this.readByte() & 0xFF) |
                    (this.readByte() & 0xFF) << 8;
                return (res + d / 65540);
            } else {
                const res = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                const d = (this.readByte() & 0xFF) << 8 |
                    (this.readByte() & 0xFF);
                return (res + d / 65540);
            }
        });

        return BinaryReader.prototype.readFixed.apply(this, params);
    }

    readDouble(...params) {
        BinaryReader.prototype.readDouble = overload([], function () {
            this.fillBuffer.call(this, 8);
            return this.#view.getFloat64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readDouble.apply(this, params);
    }

    readInt16(...params) {
        BinaryReader.prototype.readInt16 = overload([], function () {
            this.fillBuffer.call(this, 2);
            return this.#view.getInt16(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt16.apply(this, params);
    }

    readInt32(...params) {
        BinaryReader.prototype.readInt32 = overload([], function () {
            this.fillBuffer.call(this, 4);
            return this.#view.getInt32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt32.apply(this, params);
    }

    readInt64(...params) {
        BinaryReader.prototype.readInt64 = overload([], function () {
            this.fillBuffer.call(this, 8);
            return this.#view.getBigInt64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readInt64.apply(this, params);
    }

    readSByte(...params) {
        BinaryReader.prototype.readSByte = overload([], function () {
            this.fillBuffer.call(this, 1);
            let value = this.#buffer[0];
            if (value > 127) value -= 256;
            return value;
        });

        return BinaryReader.prototype.readSByte.apply(this, params);
    }

    readSingle(...params) {
        BinaryReader.prototype.readSingle = overload([], function () {
            this.fillBuffer.call(this, 4);
            return this.#view.getFloat32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readSingle.apply(this, params);
    }

    readString(...params) {
        BinaryReader.prototype.readString = overload()
            .add([], function () {
                const length = this.read7BitEncodedInt();
                return this.#encoding.getString(new Uint8Array(this.readBytes(length)));
            })
            .add([Number], function (count) {
                return this.readChars(count).join("");
            });

        return BinaryReader.prototype.readString.apply(this, params);
    }

    readUInt16(...params) {
        BinaryReader.prototype.readUInt16 = overload([], function () {
            this.fillBuffer.call(this, 2);
            return this.#view.getUint16(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt16.apply(this, ...params);
    }

    readUInt32(...params) {
        BinaryReader.prototype.readUInt32 = overload([], function () {
            this.fillBuffer.call(this, 4);
            return this.#view.getUint32(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt32.apply(this, params);
    }

    readUInt64(...params) {
        BinaryReader.prototype.readUInt64 = overload([], function () {
            this.fillBuffer.call(this, 8);
            return this.#view.getBigUint64(0, !this.#bigEndian);
        });

        return BinaryReader.prototype.readUInt64.apply(this, params);
    }

    pointer(...params) {
        BinaryReader.prototype.pointer = overload([Number, Function], async function (moveTo, action) {
            const position = this.#stream.position;
            this.#stream.seek(moveTo, SeekOrigin.begin);
            const res = await action();
            this.#stream.seek(position, SeekOrigin.begin);
            return res;
        });

        return BinaryReader.prototype.pointer.apply(this, params);
    }
}