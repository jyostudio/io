/**
 * 文件协助类
 * @class
 */
export default class FileHelper {
    /**
     * 获取绝对路径
     * @param {String} basePath 基础路径
     * @param {String} relative 相对路径
     * @returns {String} 获取到的绝对路径
     */
    static resolveAbsolutePath(basePath: String, relative: String): String;

    /**
     * 异步读取文件
     * @param {String} path 文件路径
     * @returns {Promise<Uint8Array>} 文件内容
     */
    static async(path: String): Uint8Array;

    /**
     * 同步读取文件
     * @param {String} path 文件路径
     * @returns {Uint8Array} 文件内容
     */
    static sync(path: String): Uint8Array;
}