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
}
//# sourceMappingURL=_buffer.d.ts.map