import overload from "@jyostudio/overload";

export default class Buffer {
    static blockCopy(...params) {
        Buffer.blockCopy = overload([[Uint8Array, Array], Number, [Uint8Array, Array], Number, Number], function (src, srcOffset, dst, dstOffset, count) {
            if (srcOffset < 0) {
                throw new RangeError(`"srcOffset" must be non-negative.`);
            }

            if (dstOffset < 0) {
                throw new RangeError(`"dstOffset" must be non-negative.`);
            }

            if (count < 0) {
                throw new RangeError(`"count" must be non-negative.`);
            }

            try {
                if (src instanceof Uint8Array && dst instanceof Uint8Array) {
                    let srcView = new DataView(src.buffer);
                    let dstView = new DataView(dst.buffer);

                    for (let i = 0; i < count; i++) {
                        dstView.setUint8(dstOffset + i, srcView.getUint8(srcOffset + i));
                    }
                } else {
                    for (let i = 0; i < count; i++) {
                        dst[dstOffset + i] = src[srcOffset + i];
                    }
                }
            } catch {
                if ((srcOffset > src.length - count) || (dstOffset > dst.length - count)) {
                    throw new RangeError("The source and destination arrays overlap.");
                }
            }
        });

        return Buffer.blockCopy.apply(this, params);
    }
}
