export default class _FileHelper {
    #private;
    /**
     * 解析绝对路径
     * @param path 基准路径
     * @param relative 相对路径
     */
    static resolveAbsolutePath(path: string, relative: string): string;
    /**
     * 异步加载文件
     * @param path 文件路径
     * @returns 文件内容
     */
    static async(path: string): Promise<Uint8Array>;
    /**
     * 同步加载文件
     * @param path 文件路径
     * @returns 文件内容
     */
    static sync(path: string): Uint8Array;
}
//# sourceMappingURL=_fileHelper.d.ts.map