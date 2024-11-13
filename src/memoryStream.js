import overload from "@jyostudio/overload";
import Stream from "./stream.js";
import Buffer from "./buffer.js";
import SeekOrigin from "./seekOrigin.js";

const CONSTURCTOR_SYMBOL = Symbol("constructor");

export default class MemoryStream extends Stream {
    static #memStreamMaxLength = Number.MAX_SAFE_INTEGER;

    static #maxByteArrayLength = 0x7FFFFFC7;

    #buffer = null;

    #position = 0;

    #length = 0;

    #capacity = 0;

    #writable = false;

    #expandable = false;

    #exposable = false;

    #origin = 0;

    #isOpen = false;

    get canRead() {
        return this.#isOpen;
    }

    get canSeek() {
        return this.#isOpen;
    }

    get canWrite() {
        return this.#writable;
    }

    get length() {
        this.#checkOpen();

        return this.#length - this.#origin;
    }

    static [CONSTURCTOR_SYMBOL](...params) {
        MemoryStream[CONSTURCTOR_SYMBOL] = overload()
            .add([], function () {
                return MemoryStream[CONSTURCTOR_SYMBOL].call(this, 0);
            })
            .add([Number], function (capacity) {
                if (capacity < 0) {
                    throw new Error("capacity must be non-negative.");
                }

                this.#buffer = new Uint8Array(capacity);
                this.#capacity = capacity;
                this.#writable = true;
                this.#exposable = true;
                this.#expandable = true;
                this.#origin = 0;
                this.#isOpen = true;
            })
            .add([Uint8Array], function (buffer) {
                return MemoryStream[CONSTURCTOR_SYMBOL].call(this, buffer, true);
            })
            .add([Uint8Array, Boolean], function (buffer, writable) {
                this.#buffer = buffer;
                this.#length = this.#capacity = buffer.length;
                this.#writable = writable;
                this.#exposable = false;
                this.#origin = 0;
                this.#isOpen = true;
            })
            .add([Uint8Array, Number, Number], function (buffer, index, count) {
                return MemoryStream[CONSTURCTOR_SYMBOL].call(this, buffer, index, count, true, false);
            })
            .add([Uint8Array, Number, Number, Boolean], function (buffer, index, count, writable) {
                return MemoryStream[CONSTURCTOR_SYMBOL].call(this, buffer, index, count, writable, false);
            })
            .add([Uint8Array, Number, Number, Boolean, Boolean], function (buffer, index, count, writable, publiclyVisible) {
                if (index < 0) {
                    throw new RangeError(`"index" must be non-negative.`);
                }

                if (count < 0) {
                    throw new RangeError(`"count" must be non-negative.`);
                }

                if (buffer.length - index < count) {
                    throw new RangeError("The sum of index and count is greater than the buffer length.");
                }

                this.#buffer = buffer;
                this.#origin = this.#position = index;
                this.#length = this.#capacity = index + count;
                this.#writable = writable;
                this.#exposable = publiclyVisible;
                this.#expandable = false;
                this.#isOpen = true;
            });

        return MemoryStream[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    constructor(params) {
        super();

        Object.defineProperties(this, {
            capacity: {
                get() {
                    this.#checkOpen();

                    return this.#capacity - this.#origin;
                },
                set: overload([Number], function (value) {
                    this.#checkOpen();

                    value = value | 0;

                    let expandable = this.#expandable;
                    if (!expandable && value !== this.capacity) {
                        throw new Error("The capacity cannot be set on a non-expandable MemoryStream.");
                    }

                    if (expandable && value !== this.capacity) {
                        if (value > 0) {
                            let newBuffer = new Uint8Array(value);
                            if (this.Length > 0) {
                                Buffer.blockCopy(this.#buffer, 0, newBuffer, 0, this.#length);
                            }

                            this.#buffer = newBuffer;
                        } else {
                            this.#buffer = null;
                        }
                        this.#capacity = value;
                    }
                })
            },
            position: {
                get() {
                    this.#checkOpen();

                    return this.#position - this.#origin;
                },
                set: overload([Number], function (value) {
                    this.#checkOpen();

                    value = value | 0;

                    if (value < 0) {
                        throw new RangeError("Seek before beginning.");
                    }

                    if (value > MemoryStream.#memStreamMaxLength) {
                        throw new RangeError("Seek after end.");
                    }

                    this.#position = this.#origin + value;
                })
            }
        });

        return MemoryStream[CONSTURCTOR_SYMBOL].apply(this, params);
    }

    #checkOpen() {
        if (!this.#isOpen) {
            throw new Error("The stream is closed.");
        }
    }

    #ensureCapacity(value) {
        value = value | 0;

        if (value < 0) {
            throw new RangeError(`"value" must be non-negative.`);
        }

        const capacity = this.#capacity;
        if (value > capacity) {
            let newCapacity = Math.max(Math.max(value, 256), capacity * 2);

            const maxByteArrayLength = MemoryStream.#maxByteArrayLength;
            if (capacity * 2 > maxByteArrayLength) {
                newCapacity = Math.max(value, maxByteArrayLength);
            }

            this.capacity = newCapacity;

            return true;
        }

        return false;
    }

    close(...params) {
        const superClose = super.close;
        MemoryStream.prototype.close = overload([], function () {
            this.#buffer = null;
            this.#capacity = 0;
            this.#exposable = false;
            this.#length = 0;
            this.#origin = 0;
            this.#position = 0;
            this.#isOpen = false;
            this.#writable = false;
            this.#expandable = false;

            superClose.call(this, ...params);

            return true;
        });

        return MemoryStream.prototype.close.apply(this, params);
    }

    flush(...params) {
        MemoryStream.prototype.flush = overload([], function () {
            this.#checkOpen();
        });

        return MemoryStream.prototype.flush.apply(this, params);
    }

    getBuffer(...params) {
        MemoryStream.prototype.getBuffer = overload([], function () {
            this.#checkOpen();

            if (!this.#exposable) {
                throw new Error("MemoryStream was not created with an accessible buffer.");
            }

            return this.#buffer;
        });

        return MemoryStream.prototype.getBuffer.apply(this, params);
    }

    read(...params) {
        MemoryStream.prototype.read = overload([Uint8Array, Number, Number], function (buffer, offset, count) {
            this.#checkOpen();

            if (offset < 0) {
                throw new RangeError(`"offset" must be non-negative.`);
            }

            if (count < 0) {
                throw new RangeError(`"count" must be non-negative.`);
            }

            if (buffer.length - offset < count) {
                throw new RangeError("The sum of offset and count is greater than the buffer length.");
            }

            let n = this.#length - this.#position;

            if (n > count) n = count;

            if (n <= 0) return 0;

            if (n <= 8) {
                let byteCount = n;
                while (--byteCount >= 0) {
                    buffer[offset + byteCount] = this.#buffer[this.#position + byteCount];
                }
            } else {
                Buffer.blockCopy(this.#buffer, this.#position, buffer, offset, n);
            }

            this.#position += n;

            return n;
        }).any(super.read);

        return MemoryStream.prototype.read.apply(this, params);
    }

    readByte(...params) {
        MemoryStream.prototype.readByte = overload([], function () {
            this.#checkOpen();

            if (this.#position >= this.#length) return -1;

            return this.#buffer[this.#position++];
        }).any(super.readByte);

        return MemoryStream.prototype.readByte.apply(this, params);
    }

    seek(...params) {
        MemoryStream.prototype.seek = overload([Number, SeekOrigin], function (offset, loc) {
            this.#checkOpen();

            if (offset > MemoryStream.#memStreamMaxLength) {
                throw new RangeError(`"offset" must be non-negative and less than 2^31 - 1 - origin.`);
            }

            const origin = this.#origin;
            let tempPosition;
            switch (loc) {
                case SeekOrigin.begin:
                    tempPosition = origin + (offset | 0);
                    if (offset < 0 || tempPosition < origin) {
                        throw new RangeError("seek before beginning.");
                    }
                    this.#position = tempPosition;
                    break;
                case SeekOrigin.current:
                    const position = this.#position;
                    tempPosition = position + (offset | 0);
                    if (position + offset < origin || tempPosition < origin) {
                        throw new RangeError("seek before beginning.");
                    }
                    this.#position = tempPosition;
                    break;
                case SeekOrigin.end:
                    const length = this.#length;
                    tempPosition = length + (offset | 0);
                    if (length + offset < origin || tempPosition < origin) {
                        throw new RangeError("seek before beginning.");
                    }
                    this.#position = tempPosition;
                    break;
                default:
                    throw new SyntaxError("Invalid seek origin.");
            }

            return this.#position;
        }).any(super.seek);

        return MemoryStream.prototype.seek.apply(this, params);
    }

    setLength(...params) {
        MemoryStream.prototype.setLength = overload([Number], function (value) {
            this.#checkOpen();

            if (value < 0 || value > MemoryStream.#memStreamMaxLength || value > (Number.MAX_SAFE_INTEGER - this.#origin)) {
                throw new RangeError(`"value" must be non-negative and less than 2^31 - 1 - origin.`);
            }

            const newLength = this.#origin + value;

            const length = this.#length;
            if (!this.#ensureCapacity(newLength) && newLength > length) {
                for (let i = 0; i < newLength - length; i++) {
                    this.#buffer[length + i] = 0;
                }
            }

            this.#length = newLength;

            this.#position = Math.min(this.#position, newLength);
        }).any(super.setLength);

        return MemoryStream.prototype.setLength.apply(this, params);
    }

    toArray(...params) {
        MemoryStream.prototype.toArray = overload([], function () {
            this.#checkOpen();

            const copy = new Uint8Array(this.#length - this.#origin);
            Buffer.BlockCopy(this.#buffer, this.#origin, copy, 0, this.#length - this.#origin);
            return Array.from(copy);
        });

        return MemoryStream.prototype.toArray.apply(this, params);
    }

    write(...params) {
        MemoryStream.prototype.write = overload([Uint8Array, Number, Number], function (buffer, offset, count) {
            this.#checkOpen();

            if (offset < 0) {
                throw new RangeError(`"offset" must be non-negative.`);
            }

            if (count < 0) {
                throw new RangeError(`"count" must be non-negative.`);
            }

            if (buffer.length - offset < count) {
                throw new RangeError("The sum of offset and count is greater than the buffer length.");
            }

            const i = this.#position + count;

            if (i < 0) {
                throw new IOException("IO.IO_StreamTooLong");
            }

            const length = this.#length;
            if (i > length) {
                let mustZero = this.#position > length;
                if (i > this.#capacity) {
                    let allocatedNewArray = this.#ensureCapacity(i);
                    if (allocatedNewArray) mustZero = false;
                }

                if (mustZero) {
                    for (let n = 0; n < i - length; n++) {
                        this.#buffer[length + n] = 0;
                    }
                }

                this.#length = i;
            }

            const _buffer = this.#buffer;
            if ((count <= 8) && (buffer != _buffer)) {
                let byteCount = count;
                while (--byteCount >= 0) {
                    _buffer[this.#position + byteCount] = buffer[offset + byteCount];
                }
            } else {
                Buffer.blockCopy(buffer, offset, _buffer, this.#position, count);
            }

            this.#position = i;
        }).any(super.write);

        return MemoryStream.prototype.write.apply(this, params);
    }

    writeByte(...params) {
        MemoryStream.prototype.writeByte = overload([Number], function (value) {
            this.#checkOpen();

            value = value | 0;

            if (value < 0 || value > 255) {
                throw new RangeError(`"value" must be non-negative and less than 256.`);
            }

            const position = this.#position;
            const length = this.#length;
            if (position >= length) {
                const newLength = position + 1;
                let mustZero = position > length;
                if (newLength >= this.#capacity && this.#ensureCapacity(newLength)) {
                    mustZero = false;
                }

                if (mustZero) {
                    for (let i = 0; i < position - length; i++) {
                        this.#buffer[length + i] = 0;
                    }
                }
                this.#length = newLength;
            }

            this.#buffer[this.#position++] = value;
        }).any(super.writeByte);

        return MemoryStream.prototype.writeByte.apply(this, params);
    }

    writeTo(...params) {
        MemoryStream.prototype.writeTo = overload([Stream], function (stream) {
            this.#checkOpen();

            stream.write(this.#buffer, this.#origin, this.#length - this.#origin);
        });

        return MemoryStream.prototype.writeTo.apply(this, params);
    }
}