import overload from "@jyostudio/overload";

export default class _Buffer {
    /**
     * 块拷贝方法，用于将一个字节数组的部分内容复制到另一个字节数组中。
     * @param src 源字节数组或数字数组。
     * @param srcOffset 源数组的起始偏移量。
     * @param dst 目标字节数组或数字数组。
     * @param dstOffset 目标数组的起始偏移量。
     * @param count 要复制的字节数。
     * @throws {RangeError} 如果 srcOffset、dstOffset 或 count 小于 0，或者源数组和目标数组重叠。
     */
    static blockCopy(src: Uint8Array | Array<number>, srcOffset: number, dst: Uint8Array | Array<number>, dstOffset: number, count: number): void;

    static blockCopy(...params: any): any {
        _Buffer.blockCopy = overload([[Uint8Array, Array], Number, [Uint8Array, Array], Number, Number], function (src: Uint8Array, srcOffset: number, dst: Uint8Array, dstOffset: number, count: number): void {
            if (srcOffset < 0) {
                throw new RangeError(`"srcOffset"必须为非负数。`);
            }

            if (dstOffset < 0) {
                throw new RangeError(`"dstOffset"必须为非负数。`);
            }

            if (count < 0) {
                throw new RangeError(`"count"必须为非负数。`);
            }

            try {
                if (src instanceof Uint8Array && dst instanceof Uint8Array) {
                    const srcView = new DataView(src.buffer);
                    const dstView = new DataView(dst.buffer);

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
                    throw new RangeError("源数组和目标数组重叠。");
                }
            }
        });

        return _Buffer.blockCopy.apply(this, params);
    }
}