import List from "@jyostudio/list";
/**
 * 对包含文件或目录路径信息的 String 实例执行操作。这些操作是以跨平台的方式执行的。
 */
export default class Path {
    #private;
    /**
     * 用于在环境变量中分隔路径字符串的平台特定的分隔符。
     */
    static get pathSeparator(): string;
    /**
     * 提供平台特定的字符，该字符用于在反映分层文件系统组织的路径字符串中分隔目录级别。
     */
    static get directorySeparatorChar(): string;
    /**
     * 提供平台特定的替换字符，该替换字符用于在反映分层文件系统组织的路径字符串中分隔目录级别。
     */
    static get altDirectorySeparatorChar(): string;
    /**
     * 提供平台特定的卷分隔符。
     */
    static get volumeSeparatorChar(): string;
    /**
     * 提供平台特定的字符数组，这些字符不能在传递到 Path 类的成员的路径字符串参数中指定。
     */
    static get invalidPathChars(): readonly string[];
    /**
     * 更改路径字符串的扩展名。
     * @param path 要修改的路径信息。该路径不能包含在 Path.getInvalidPathChars() 中定义的任何字符。
     * @param extension 新的扩展名（有或没有前导句点）。指定 null 以从 path 移除现有扩展名。
     * @returns 包含修改的路径信息的字符串。在基于 Windows 的桌面平台上，如果 path 是 null 或空字符串 ("")，则返回的路径信息是未修改的。如果 extension 是 null，则返回的字符串包含指定的路径，其扩展名已移除。如果 path 不具有扩展名，并且 extension 不是 null，则返回的路径字符串包含 extension，它追加到 path 的结尾。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static changeExtension(path: string | null, extension: string | null): string | null;
    /**
     * 将两个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @returns 包含合并的路径的字符串。如果指定的路径之一是零长度字符串，则该方法返回其他路径。如果 path2 包含绝对路径，则该方法返回 path2。
     * @throws path1 或 path2 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static combine(path1: string, path2: string): string;
    /**
     * 将三个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @param path3 要组合的第三个路径。
     * @returns 包含合并的路径的字符串。
     * @throws path1、path2 或 path3 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static combine(path1: string, path2: string, path3: string): string;
    /**
     * 将四个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @param path3 要组合的第三个路径。
     * @param path4 要组合的第四个路径。
     * @returns 包含合并的路径的字符串。
     * @throws path1、path2、path3 或 path4 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static combine(path1: string, path2: string, path3: string, path4: string): string;
    /**
     * 将字符串数组组合成一个路径。
     * @param paths 由路径的各部分构成的数组。
     * @returns 包含合并的路径的字符串。
     * @throws 数组中的一个字符串包含 Path.getInvalidPathChars() 中定义的一个或多个无效字符。
     */
    static combine(paths: string[] | List<string>): string;
    /**
     * 返回指定路径字符串的目录信息。
     * @param path 文件或目录的路径。
     * @returns 包含 path 目录信息的 String；或者为 null（如果 path 表示根目录、是空字符串 ("") 或是 null）。如果 path 没有包含目录信息，则返回空白 String。
     * @throws path 参数包含无效字符、为空、或仅包含空白。
     */
    static getDirectoryName(path: string | null): string | null;
    /**
     * 返回指定的路径字符串的扩展名。
     * @param path 从其获取扩展名的路径字符串。
     * @returns 包含指定路径的扩展名（包括"."）的 String、null 或空白 String。如果 path 为 null，则 GetExtension 返回 null。如果 path 不具有扩展名信息，则 GetExtension 返回 Empty。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static getExtension(path: string | null): string | null;
    /**
     * 返回指定路径字符串的文件名和扩展名。
     * @param path 从其获取文件名和扩展名的路径字符串。
     * @returns 一个 String，由 path 中最后的目录字符后的字符组成。如果 path 的最后一个字符是目录或卷分隔符，则此方法返回空白 String。如果 path 为 null，则此方法返回 null。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static getFileName(path: string | null): string | null;
    /**
     * 返回不具有扩展名的指定路径字符串的文件名。
     * @param path 文件的路径。
     * @returns 包含由 Path.getFileName(String) 返回的字符串的 String，但不包括最后的句点 (.) 和该句点后的所有字符。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static getFileNameWithoutExtension(path: string): string;
    /**
     * 返回指定路径字符串的绝对路径。
     * @param path 要为其获取绝对路径信息的文件或目录。
     * @returns 包含 path 的完全限定位置的字符串，例如"C:\MyFile.txt"。
     * @throws path 是一个零长度字符串，仅包含空白或者包含 Path.getInvalidPathChars() 中已定义一个或多个无效字符。- 或 -系统未能检索绝对路径。
     */
    static getFullPath(path: string | null): string;
    /**
     * 获取包含不允许在文件名中使用的字符的数组。
     * @returns 包含不允许在文件名中使用的字符的数组。
     */
    static getInvalidFileNameChars(): readonly string[];
    /**
     * 获取包含不允许在路径名中使用的字符的数组。
     * @returns 包含不允许在路径名中使用的字符的数组。
     */
    static getInvalidPathChars(): readonly string[];
    /**
     * 获取指定路径的根目录信息。
     * @param path 从其获取根目录信息的路径。
     * @returns 一个包含 path 的根目录的字符串，例如"C:\"；如果 path 为 null，则为 null；如果 path 不包含根目录信息，则为空字符串。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。- 或空白 String 被传递到 path。
     */
    static getPathRoot(path: string | null): string;
    /**
     * 返回随机文件夹名或文件名。
     * @returns 随机文件夹名或文件名。
     */
    static getRandomFileName(): string;
    /**
     * 在磁盘上创建具有唯一名称的零字节临时文件并返回该文件的完整路径。
     * @returns 临时文件的完整路径。
     */
    static getTempFileName(): string;
    /**
     * 返回当前系统的临时文件夹的路径。
     * @returns 包含临时目录的路径信息的 String。
     */
    static getTempPath(): string;
    /**
     * 确定路径是否包括文件扩展名。
     * @param path 用于搜索扩展名的路径。
     * @returns 如果路径中最后的目录分隔符（\\ 或 /）或卷分隔符 (:) 之后的字符包括句点 (.)，并且后面跟有一个或多个字符，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static hasExtension(path: string | null): boolean;
    /**
     * 获取路径的最大允许长度。
     * @returns 路径的最大允许长度。
     */
    static getMaxPathLength(): number;
    /**
     * 获取目录路径的最大允许长度。
     * @returns 目录路径的最大允许长度。
     */
    static getMaxDirectoryPathLength(): number;
    /**
     * 检查路径是否包含通配符字符（* 或 ?）。
     * @param path 要检查的路径。
     * @returns 如果路径包含通配符则返回 true，否则返回 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static hasWildCardCharacters(path: string | null): boolean;
    /**
     * 获取一个值，该值指示指定的路径字符串是包含绝对路径信息还是包含相对路径信息。
     * @param path 要测试的路径。
     * @returns 如果 path 包含绝对路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static isPathRooted(path: string | null): boolean;
    /**
     * 获取一个值，该值指示指定的路径字符串是否为UNC（通用命名约定）路径。
     * @param path 要测试的路径。
     * @returns 如果 path 是UNC路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static isUncPath(path: string | null): boolean;
    /**
     * 获取一个值，该值指示指定的路径字符串是否为设备路径。
     * @param path 要测试的路径。
     * @returns 如果 path 是设备路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    static isDevicePath(path: string | null): boolean;
}
//# sourceMappingURL=path.d.ts.map