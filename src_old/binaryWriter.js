import overload from "@jyostudio/overload";
import List from "@jyostudio/list";
import { Encoding, StringBuilder, UTF8Encoding } from "@jyostudio/text";
import Stream from "./stream.js";
import SeekOrigin from "./seekOrigin.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class BinaryWriter {
    static #null;

    static get null() {
        return this.#null ??= new BinaryWriter(Stream.null);
    }

    #stream;

    #buffer;

    #view;

    #encoding;

    get baseStream() {
        return this.#stream;
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        BinaryWriter[CONSTURCTOR_SYMBOL] = overload()
            .add([Stream], function (output) {
                return BinaryWriter[CONSTURCTOR_SYMBOL].call(this, output, new UTF8Encoding());
            })
            .add([Stream, Encoding], function (output, encoding) {
                if (!output.canWrite) throw new EvalError("The stream does not support writing.");

                this.#stream = output;
                this.#encoding = encoding;
                this.#buffer = new Uint8Array(16);
                this.#view = new DataView(this.#buffer.buffer);
            });

        return BinaryWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(...params) {
        return BinaryWriter[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    close(...params) {
        BinaryWriter.prototype.close = overload([], function () {
            BinaryWriter.prototype[Symbol.dispose].apply(this);
        });

        return BinaryWriter.prototype.close.apply(this, params);
    }

    [Symbol.dispose](...params) {
        BinaryWriter.prototype[Symbol.dispose] = overload([], function () {
            this.#stream.close();
            this.#stream = null;
            this.#encoding = null;
            this.#buffer = null;
            this.#view = null;
        });

        return BinaryWriter.prototype[Symbol.dispose].apply(this, params);
    }

    flush(...params) {
        BinaryWriter.prototype.flush = overload([], function () {
            this.#stream.flush();
        });

        return BinaryWriter.prototype.flush.apply(this, params);
    }

    seek(...params) {
        BinaryWriter.prototype.seek = overload([Number, SeekOrigin], function (offset, origin) {
            return this.#stream.seek(offset, origin);
        });

        return BinaryWriter.prototype.seek.apply(this, params);
    }

    writeBoolean(...params) {
        BinaryWriter.prototype.writeBoolean = overload([Boolean], function (value) {
            this.#view.setUint8(0, value ? 1 : 0);
            this.#stream.write(this.#buffer, 0, 1);
        });

        return BinaryWriter.prototype.writeBoolean.apply(this, params);
    }

    writeByte(...params) {
        BinaryWriter.prototype.writeByte = overload([Number], function (value) {
            this.#stream.writeByte(value);
        });

        return BinaryWriter.prototype.writeByte.apply(this, params);
    }

    writeBytes(...params) {
        BinaryWriter.prototype.writeBytes = overload()
            .add([Uint8Array], function (buffer) {
                this.#stream.write(buffer, 0, buffer.length);
            })
            .add([Uint8Array, Number, Number], function (buffer, index, count) {
                this.#stream.write(buffer, index, count);
            });

        return BinaryWriter.prototype.writeBytes.apply(this, params);
    }

    writeChar(...params) {
        BinaryWriter.prototype.writeChar = overload([String], function (value) {
            if (value.length !== 1) throw new RangeError("value must be a single character.");

            let bytes = this.#encoding.getBytes(value);
            this.#stream.write(bytes, 0, bytes.length);
        });

        return BinaryWriter.prototype.writeChar.apply(this, params);
    }

    writeChars(...params) {
        BinaryWriter.prototype.writeChars = overload()
            .add([List.T(String)], function (value) {
                this.writeChars.call(this, value, 0, value.length);
            })
            .add([List.T(String), Number, Number], function (chars, index, count) {
                const str = new StringBuilder();

                for (let i = 0; i < chars.length; i++) {
                    if (chars[i].length !== 1) {
                        throw new RangeError("value must be a single character.");
                    }
                    str.append(chars[i]);
                }

                const bytes = this.#encoding.getBytes(str.toString(), index, count);
                this.#stream.write(bytes, 0, bytes.length);
            });

        return BinaryWriter.prototype.writeChars.apply(this, params);
    }

    writeDouble(...params) {
        BinaryWriter.prototype.writeDouble = overload([Number], function (value) {
            this.#view.setFloat64(0, value, true);
            this.#stream.write(this.#buffer, 0, 8);
        });

        return BinaryWriter.prototype.writeDouble.apply(this, params);
    }

    writeSingle(...params) {
        BinaryWriter.prototype.writeSingle = overload([Number], function (value) {
            this.#view.setFloat32(0, value, true);
            this.#stream.write(this.#buffer, 0, 4);
        });

        return BinaryWriter.prototype.writeSingle.apply(this, params);
    }

    writeString(...params) {
        BinaryWriter.prototype.writeString = overload([String], function (value) {
            const bytes = this.#encoding.getBytes(value);
            this.write7BitEncodedInt(bytes.length);
            this.#stream.write(bytes, 0, bytes.length);
        });

        return BinaryWriter.prototype.writeString.apply(this, params);
    }

    writeInt16(...params) {
        BinaryWriter.prototype.writeInt16 = overload([Number], function (value) {
            this.#view.setInt16(0, value, true);
            this.#stream.write(this.#buffer, 0, 2);
        });

        return BinaryWriter.prototype.writeInt16.apply(this, params);
    }

    writeInt32(...params) {
        BinaryWriter.prototype.writeInt32 = overload([Number], function (value) {
            this.#view.setInt32(0, value, true);
            this.#stream.write(this.#buffer, 0, 4);
        });

        return BinaryWriter.prototype.writeInt32.apply(this, params);
    }

    writeInt64(...params) {
        BinaryWriter.prototype.writeInt64 = overload([[Number, BigInt]], function (value) {
            this.#view.setBigInt64(0, BigInt(value), true);
            this.#stream.write(this.#buffer, 0, 8);
        });

        return BinaryWriter.prototype.writeInt64.apply(this, params);
    }

    writeSByte(...params) {
        BinaryWriter.prototype.writeSByte = overload([Number], function (value) {
            if (value > 127) value -= 256;
            this.#view.setInt8(0, value);
            this.#stream.write(this.#buffer, 0, 1);
        });

        return BinaryWriter.prototype.writeSByte.apply(this, params);
    }

    writeUInt16(...params) {
        BinaryWriter.prototype.writeUInt16 = overload([Number], function (value) {
            this.#view.setUint16(0, value, true);
            this.#stream.write(this.#buffer, 0, 2);
        });

        return BinaryWriter.prototype.writeUInt16.apply(this, params);
    }

    writeUInt32(...params) {
        BinaryWriter.prototype.writeUInt32 = overload([Number], function (value) {
            this.#view.setUint32(0, value, true);
            this.#stream.write(this.#buffer, 0, 4);
        });

        return BinaryWriter.prototype.writeUInt32.apply(this, params);
    }

    writeUInt64(...params) {
        BinaryWriter.prototype.writeUInt64 = overload([[Number, BigInt]], function (value) {
            this.#view.setBigUint64(0, BigInt(value), true);
            this.#stream.write(this.#buffer, 0, 8);
        });

        return BinaryWriter.prototype.writeUInt64.apply(this, params);
    }

    write7BitEncodedInt(...params) {
        BinaryWriter.prototype.write7BitEncodedInt = overload([Number], function (value) {
            let v = +value;
            while (v >= 0x80) {
                this.writeByte(v | 0x80);
                v >>= 7;
            }
            this.writeByte(v);
        });

        return BinaryWriter.prototype.write7BitEncodedInt.apply(this, params);
    }
}