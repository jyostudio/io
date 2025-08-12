import List from "@jyostudio/list";
import overload from "@jyostudio/overload";
import { StringBuilder } from "@jyostudio/text";
import _FileHelper from "./_fileHelper";

/**
 * 对包含文件或目录路径信息的 String 实例执行操作。这些操作是以跨平台的方式执行的。
 */
export default class Path {
    /**
     * 表示扩展路径前缀。
     */
    static get #extendedPathPrefix(): string {
        return "\\\\?\\";
    }

    /**
     * 表示UNC路径前缀。
     */
    static get #uncPathPrefix(): string {
        return "\\\\";
    }

    /**
     * 表示UNC扩展路径前缀。
     */
    static get #uncExtendedPathPrefix(): string {
        return "\\\\?\\UNC\\";
    }

    /**
     * 表示设备路径前缀。
     */
    static get #devicePathPrefix(): string {
        return "\\\\.\\";
    }

    /**
     * 表示设备前缀长度。
     */
    static get #devicePrefixLength(): number {
        return 4;
    }

    /**
     * 表示最大路径长度。
     */
    static get #maxPath(): number {
        return 260;
    }

    /**
     * 表示最大目录长度。
     */
    static get #maxDirectoryLength(): number {
        return 255;
    }

    /**
     * 表示最大路径常量。
     */
    static get #MAX_PATH(): number {
        return 260;
    }

    /**
     * 表示最大目录路径长度。
     */
    static get #MAX_DIRECTORY_PATH(): number {
        return 248;
    }

    /**
     * 用于在环境变量中分隔路径字符串的平台特定的分隔符。
     */
    public static get pathSeparator(): string {
        return ";";
    }

    /**
     * 目录分隔符字符的字符串表示。
     */
    static #directorySeparatorCharAsString = "\\";

    /**
     * 提供平台特定的字符，该字符用于在反映分层文件系统组织的路径字符串中分隔目录级别。
     */
    public static get directorySeparatorChar(): string {
        return "\\";
    }

    /**
     * 提供平台特定的替换字符，该替换字符用于在反映分层文件系统组织的路径字符串中分隔目录级别。
     */
    public static get altDirectorySeparatorChar(): string {
        return "/";
    }

    /**
     * 提供平台特定的卷分隔符。
     */
    public static get volumeSeparatorChar(): string {
        return ":";
    }

    /**
     * 随机字符缓存。
     */
    static #randomCharsReal: string | null = null;

    /**
     * 获取随机字符集合。
     */
    static get #randomChars(): string {
        if (!this.#randomCharsReal) {
            this.#randomCharsReal = "abcdefghijklmnopqrstuvwxyz1234567890";
        }
        return this.#randomCharsReal;
    }

    /**
     * 包含附加检查的无效路径字符缓存。
     */
    static #invalidPathCharsWithAdditionalChecksReal: readonly string[] | null = null;

    /**
     * 获取包含附加检查的无效路径字符。
     */
    static get #invalidPathCharsWithAdditionalChecks(): readonly string[] {
        if (!this.#invalidPathCharsWithAdditionalChecksReal) {
            const invalidChars = "\"<>|\0*?".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(String.fromCharCode(i));
            }
            this.#invalidPathCharsWithAdditionalChecksReal = new Proxy(invalidChars, {
                get(obj: string[], prop: string | symbol | number) {
                    return (obj as any)[prop];
                },
                set() {
                    throw new Error("不能修改只读属性。");
                }
            }) as readonly string[];
        }
        return this.#invalidPathCharsWithAdditionalChecksReal;
    }

    /**
     * 无效路径字符缓存。
     */
    static #invalidPathCharsReal: readonly string[] | null = null;

    /**
     * 提供平台特定的字符数组，这些字符不能在传递到 Path 类的成员的路径字符串参数中指定。
     */
    public static get invalidPathChars(): readonly string[] {
        if (!this.#invalidPathCharsReal) {
            const invalidChars = "\"<>|\0".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(String.fromCharCode(i));
            }
            this.#invalidPathCharsReal = new Proxy(invalidChars, {
                get(obj: string[], prop: string | symbol | number) {
                    if (typeof (obj as any)[prop] === "function") {
                        return ((obj as any)[prop] as Function).bind(obj);
                    }
                    return (obj as any)[prop];
                },
                set() {
                    throw new Error("不能修改只读属性。");
                }
            }) as readonly string[];
        }
        return this.#invalidPathCharsReal;
    }

    /**
     * 无效文件名字符缓存。
     */
    static #invalidFileNameCharsReal: readonly string[] | null = null;

    /**
     * 获取无效文件名字符。
     */
    static get #invalidFileNameChars(): readonly string[] {
        if (!this.#invalidFileNameCharsReal) {
            const invalidChars = "\"<>|\0:*?\\/".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(String.fromCharCode(i));
            }
            this.#invalidFileNameCharsReal = new Proxy(invalidChars, {
                get(obj: string[], prop: string | symbol | number) {
                    if (typeof (obj as any)[prop] === "function") {
                        return ((obj as any)[prop] as Function).bind(obj);
                    }
                    return (obj as any)[prop];
                },
                set() {
                    throw new Error("不能修改只读属性。");
                }
            }) as readonly string[];
        }
        return this.#invalidFileNameCharsReal;
    }

    /**
     * 检查路径长度是否超出限制。
     * @param path 要检查的路径。
     * @returns 如果路径过长则返回 true。
     */
    static #isPathTooLong = function (...params: any): boolean {
        Path.#isPathTooLong = overload([String], function (path: string) {
            return path.length > Path.#maxPath;
        });

        return Path.#isPathTooLong.apply(null, params);
    };

    /**
     * 检查目录名长度是否超出限制。
     * @param directoryName 要检查的目录名。
     * @returns 如果目录名过长则返回 true。
     */
    static #isDirectoryNameTooLong = function (...params: any): boolean {
        Path.#isDirectoryNameTooLong = overload([String], function (directoryName: string) {
            return directoryName.length > Path.#maxDirectoryLength;
        });

        return Path.#isDirectoryNameTooLong.apply(null, params);
    };

    /**
     * 判断路径是否为UNC路径。
     * @param path 要检查的路径。
     * @returns 如果是UNC路径则返回 true。
     */
    static #isUnc = function (...params: any): boolean {
        Path.#isUnc = overload([[String, StringBuilder]], function (path: string | StringBuilder) {
            const pathStr = typeof path === "string" ? path : path.toString();
            return pathStr.length >= Path.#uncPathPrefix.length
                && pathStr.startsWith(Path.#uncPathPrefix)
                && !Path.#isExtended(pathStr);
        });

        return Path.#isUnc.apply(null, params);
    };

    /**
     * 判断路径是否为设备路径（如 \\.\ 开头）。
     * @param path 要检查的路径。
     * @returns 如果是设备路径则返回 true。
     */
    static #isDevicePath = function (...params: any): boolean {
        Path.#isDevicePath = overload([[String, StringBuilder]], function (path: string | StringBuilder) {
            const pathStr = typeof path === "string" ? path : path.toString();
            return pathStr.length >= Path.#devicePathPrefix.length
                && pathStr.startsWith(Path.#devicePathPrefix);
        });

        return Path.#isDevicePath.apply(null, params);
    };

    /**
     * 检查路径中的无效字符。
     * @param path 要检查的路径。
     * @param checkAdditional 是否检查附加字符。
     */
    static #checkInvalidPathChars = function (...params: any): void {
        Path.#checkInvalidPathChars = overload()
            .add([String], function (path: string) {
                return Path.#checkInvalidPathChars(path, false);
            })
            .add([String, Boolean], function (path: string, checkAdditional: boolean) {
                if (Path.#hasIllegalCharacters(path, checkAdditional)) {
                    throw new Error("路径包含非法字符。");
                }
                // 检查路径长度
                if (Path.#isPathTooLong(path)) {
                    throw new Error("路径过长。");
                }
            });

        return Path.#checkInvalidPathChars.apply(null, params);
    };

    /**
     * 检查路径是否包含非法字符。
     * @param path 要检查的路径。
     * @param checkAdditional 是否检查附加字符。
     * @returns 如果包含非法字符则返回 true。
     */
    static #hasIllegalCharacters = function (...params: any): boolean {
        Path.#hasIllegalCharacters = overload()
            .add([String], function (path: string) {
                return Path.#hasIllegalCharacters(path, false);
            })
            .add([String, Boolean], function (path: string, checkAdditional: boolean) {
                if (Path.#isDevice(path)) {
                    return false;
                }
                return Path.#andPathHasIllegalCharacters(path, checkAdditional);
            });

        return Path.#hasIllegalCharacters.apply(null, params);
    };

    /**
     * 检查路径是否包含非法字符的内部方法。
     * @param path 要检查的路径。
     * @param checkAdditional 是否检查附加字符。
     * @returns 如果包含非法字符则返回 true。
     */
    static #andPathHasIllegalCharacters = function (...params: any): boolean {
        Path.#andPathHasIllegalCharacters = overload()
            .add([String], function (path: string) {
                return Path.#andPathHasIllegalCharacters(path, false);
            })
            .add([String, Boolean], function (path: string, checkAdditional: boolean) {
                const invalidChars = checkAdditional ? Path.#invalidPathCharsWithAdditionalChecks : Path.invalidPathChars;
                for (let i = 0; i < path.length; i++) {
                    if (invalidChars.indexOf(path[i]) >= 0) return true;
                }
                return checkAdditional && Path.#anyPathHasWildCardCharacters(path);
            });

        return Path.#andPathHasIllegalCharacters.apply(null, params);
    };

    /**
     * 检查路径是否包含通配符。
     * @param path 要检查的路径。
     * @returns 如果包含通配符则返回 true。
     */
    static #hasWildCardCharacters = function (...params: any): boolean {
        Path.#hasWildCardCharacters = overload([String], function (path: string) {
            const startIndex = Path.#isDevice(path) ? Path.#extendedPathPrefix.length : 0;
            return Path.#anyPathHasWildCardCharacters(path, startIndex);
        });

        return Path.#hasWildCardCharacters.apply(null, params);
    };

    /**
     * 检查路径的任何部分是否包含通配符。
     * @param path 要检查的路径。
     * @param startIndex 开始检查的索引。
     * @returns 如果包含通配符则返回 true。
     */
    static #anyPathHasWildCardCharacters = function (...params: any): boolean {
        Path.#anyPathHasWildCardCharacters = overload()
            .add([String], function (path: string) {
                return Path.#anyPathHasWildCardCharacters(path, 0);
            })
            .add([String, Number], function (path: string, startIndex: number) {
                let currentChar;
                for (let i = startIndex; i < path.length; i++) {
                    currentChar = path[i];
                    if (currentChar === "*" || currentChar === "?") {
                        return true;
                    }
                }
                return false;
            });

        return Path.#anyPathHasWildCardCharacters.apply(null, params);
    };

    /**
     * 判断字符是否为目录分隔符。
     * @param c 要检查的字符。
     * @returns 如果是目录分隔符则返回 true。
     */
    static #isDirectorySeparator = function (...params: any): boolean {
        Path.#isDirectorySeparator = overload([String], function (c: string) {
            return (c === Path.#directorySeparatorCharAsString || c === Path.altDirectorySeparatorChar);
        });

        return Path.#isDirectorySeparator.apply(null, params);
    };

    /**
     * 判断路径是否为设备路径。
     * @param path 要检查的路径。
     * @returns 如果是设备路径则返回 true。
     */
    static #isDevice = function (...params: any): boolean {
        Path.#isDevice = overload([[String, StringBuilder]], function (path: string | StringBuilder) {
            const pathStr = typeof path === "string" ? path : path.toString();
            return Path.#isExtended(pathStr) || Path.#isDevicePath(pathStr) || (
                pathStr.length > Path.#devicePrefixLength
                && Path.#isDirectorySeparator(pathStr[0])
                && Path.#isDirectorySeparator(pathStr[1])
                && (pathStr[2] == "." || pathStr[2] == "?")
                && Path.#isDirectorySeparator(pathStr[3])
            );
        });

        return Path.#isDevice.apply(null, params);
    };

    /**
     * 判断路径是否为扩展路径。
     * @param path 要检查的路径。
     * @returns 如果是扩展路径则返回 true。
     */
    static #isExtended = function (...params: any): boolean {
        Path.#isExtended = overload([[String, StringBuilder]], function (path: string | StringBuilder) {
            const pathStr = typeof path === "string" ? path : path.toString();
            return pathStr.length >= Path.#devicePrefixLength
                && pathStr[0] === "\\"
                && (pathStr[1] === "\\" || pathStr[1] === "?")
                && pathStr[2] === "?"
                && pathStr[3] === "\\";
        });

        return Path.#isExtended.apply(null, params);
    };

    /**
     * 判断路径是否为扩展UNC路径。
     * @param path 要检查的路径。
     * @returns 如果是扩展UNC路径则返回 true。
     */
    static #isExtendedUnc = function (...params: any): boolean {
        Path.#isExtendedUnc = overload([[String, StringBuilder]], function (path: string | StringBuilder) {
            const pathStr = typeof path === "string" ? path : path.toString();
            return pathStr.length >= Path.#uncExtendedPathPrefix.length
                && Path.#isExtended(pathStr)
                && pathStr[4].toUpperCase() === "U"
                && pathStr[5].toUpperCase() === "N"
                && pathStr[6].toUpperCase() === "C"
                && pathStr[7] === "\\";
        });

        return Path.#isExtendedUnc.apply(null, params);
    };

    /**
     * 判断路径是否为根路径（内部方法）。
     * @param path 要检查的路径。
     * @returns 如果是根路径则返回 true。
     */
    static #isPathRooted = function (...params: any): boolean {
        Path.#isPathRooted = overload([[String, null]], function (path: string | null) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                const length = path.length;
                if ((length >= 1 && (path[0] === Path.directorySeparatorChar || path[0] === Path.altDirectorySeparatorChar)) || (length >= 2 && path[1] === Path.volumeSeparatorChar)) {
                    return true;
                }
            }
            return false;
        });

        return Path.#isPathRooted.apply(null, params);
    };

    /**
     * 判断字符是否为有效的驱动器字符。
     * @param value 要检查的字符。
     * @returns 如果是有效的驱动器字符则返回 true。
     */
    static #isValidDriveChar = function (...params: any): boolean {
        Path.#isValidDriveChar = overload([String], function (value: string) {
            return ((value >= "A" && value <= "Z") || (value >= "a" && value <= "z"));
        });

        return Path.#isValidDriveChar.apply(null, params);
    };

    /**
     * 合并路径（无检查）。
     * @param path1 第一个路径。
     * @param path2 第二个路径。
     * @returns 合并后的路径。
     */
    static #combineNoChecks = function (...params: any): string {
        Path.#combineNoChecks = overload([String, String], function (path1: string, path2: string) {
            if (!path2.length) {
                return path1;
            }

            if (!path1.length) {
                return path2;
            }

            if (Path.#isPathRooted(path2)) {
                return path2;
            }

            const ch = path1[path1.length - 1];
            if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch !== Path.volumeSeparatorChar) {
                return path1 + Path.#directorySeparatorCharAsString + path2;
            }

            return path1 + path2;
        });

        return Path.#combineNoChecks.apply(null, params);
    };

    /**
     * 检查字符串是否以指定值开头。
     * @param source 源字符串。
     * @param sourceLength 源字符串长度。
     * @param value 要检查的值。
     * @returns 如果以指定值开头则返回 true。
     */
    static #startsWithOrdinal = function (...params: any): boolean {
        Path.#startsWithOrdinal = overload([String, Number, String], function (source: string, sourceLength: number, value: string) {
            if (sourceLength < value.length) {
                return false;
            }

            for (let i = 0; i < value.length; i++) {
                if (value[i] !== source[i]) {
                    return false;
                }
            }

            return true;
        });

        return Path.#startsWithOrdinal.apply(null, params);
    };

    /**
     * 获取根路径长度。
     * @param path 要检查的路径。
     * @returns 根路径长度。
     */
    static #getRootLength = function (...params: any): number {
        Path.#getRootLength = overload([String], function (path: string) {
            Path.#checkInvalidPathChars(path);

            let i = 0;
            let volumeSeparatorLength = 2;
            let uncRootLength = 2;

            const extendedSyntax = Path.#startsWithOrdinal(path, path.length, Path.#extendedPathPrefix);
            const extendedUncSyntax = Path.#startsWithOrdinal(path, path.length, Path.#uncExtendedPathPrefix);

            if (extendedSyntax) {
                if (extendedUncSyntax) {
                    uncRootLength = Path.#uncExtendedPathPrefix.length;
                } else {
                    volumeSeparatorLength = Path.#extendedPathPrefix.length;
                }
            }

            if ((!extendedSyntax || extendedUncSyntax) && path.length > 0 && Path.#isDirectorySeparator(path[0])) {
                i = 1;
                if (extendedUncSyntax || (path.length > 1 && Path.#isDirectorySeparator(path[1]))) {
                    i = uncRootLength;
                    let n = 2;
                    while (i < path.length && (!Path.#isDirectorySeparator(path[i]) || --n > 0)) {
                        i++;
                    }
                }
            } else if (path.length >= volumeSeparatorLength && path[volumeSeparatorLength - 1] === Path.volumeSeparatorChar) {
                i = volumeSeparatorLength;
                if (path.length >= volumeSeparatorLength + 1 && Path.#isDirectorySeparator(path[volumeSeparatorLength])) {
                    i++;
                }
            }

            return i;
        });

        return Path.#getRootLength.apply(null, params);
    };

    /**
     * 获取路径开始跳过的空格数。
     * @param path 要检查的路径。
     * @returns 跳过的空格数。
     */
    static #pathStartSkip = function (...params: any): number {
        Path.#pathStartSkip = overload([String], function (path: string) {
            let startIndex = 0;
            while (startIndex < path.length && path[startIndex] === " ") {
                startIndex++;
            }

            if (startIndex > 0 && (startIndex < path.length && Path.#isDirectorySeparator(path[startIndex]))
                || (startIndex + 1 < path.length && path[startIndex + 1] === Path.volumeSeparatorChar && Path.#isValidDriveChar(path[startIndex]))) {
                return startIndex;
            }

            return 0;
        });

        return Path.#pathStartSkip.apply(null, params);
    };

    /**
     * 规范化目录分隔符。
     * @param path 要规范化的路径。
     * @returns 规范化后的路径。
     */
    static #normalizeDirectorySeparators = function (...params: any): string {
        Path.#normalizeDirectorySeparators = overload([String], function (path: string) {
            if (!path.trim()) {
                return path;
            }

            let current;
            const start = Path.#pathStartSkip(path);

            if (start === 0) {
                let normalized = true;

                for (let i = 0; i < path.length; i++) {
                    current = path[i];
                    if (Path.#isDirectorySeparator(current)
                        && (current !== Path.directorySeparatorChar
                            || (i > 0 && i + 1 < path.length && Path.#isDirectorySeparator(path[i + 1])))) {
                        normalized = false;
                        break;
                    }
                }

                if (normalized) {
                    return path;
                }
            }

            const builder = new StringBuilder();

            if (Path.#isDirectorySeparator(path[start])) {
                builder.append(Path.directorySeparatorChar);
            }

            for (let i = start; i < path.length; i++) {
                current = path[i];

                if (Path.#isDirectorySeparator(current)) {
                    if (i + 1 < path.length && Path.#isDirectorySeparator(path[i + 1])) {
                        continue;
                    }
                    current = Path.directorySeparatorChar;
                }

                builder.append(current);
            }

            return builder.toString();
        });

        return Path.#normalizeDirectorySeparators.apply(null, params);
    };

    /**
     * 标准化路径（有限检查）。
     * @param path 要标准化的路径。
     * @returns 标准化后的路径。
     */
    static #newNormalizePathLimitedChecks = function (...params: any): string {
        Path.#newNormalizePathLimitedChecks = overload([String], function (path: string) {
            const normalized = Path.#normalizeDirectorySeparators(path);
            return normalized;
        });

        return Path.#newNormalizePathLimitedChecks.apply(null, params);
    };

    /**
     * 标准化路径。
     * @param path 要标准化的路径。
     * @returns 标准化后的路径。
     */
    static #normalizePath = function (...params: any): string {
        Path.#normalizePath = overload([String], function (path: string) {
            if (Path.#isExtended(path)) {
                return path;
            }

            const normalizedPath = Path.#newNormalizePathLimitedChecks(path);

            if (!normalizedPath.trim()) {
                throw new Error("路径为空。");
            }

            return normalizedPath;
        });

        return Path.#normalizePath.apply(null, params);
    };

    /**
     * 更改路径字符串的扩展名。
     * @param path 要修改的路径信息。该路径不能包含在 Path.getInvalidPathChars() 中定义的任何字符。
     * @param extension 新的扩展名（有或没有前导句点）。指定 null 以从 path 移除现有扩展名。
     * @returns 包含修改的路径信息的字符串。在基于 Windows 的桌面平台上，如果 path 是 null 或空字符串 ("")，则返回的路径信息是未修改的。如果 extension 是 null，则返回的字符串包含指定的路径，其扩展名已移除。如果 path 不具有扩展名，并且 extension 不是 null，则返回的路径字符串包含 extension，它追加到 path 的结尾。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static changeExtension(path: string | null, extension: string | null): string | null;

    public static changeExtension(...params: any): any {
        Path.changeExtension = overload([[String, null], [String, null]], function (path: string | null, extension: string | null): string | null {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let s = path;
                for (let i = path.length; --i >= 0;) {
                    const ch = path[i];
                    if (ch === ".") {
                        s = path.substr(0, i);
                        break;
                    }
                    if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                        break;
                    }
                }

                if (extension !== null && path.length != 0) {
                    if (extension.length != 0 && extension[0] != ".") {
                        s = s + ".";
                    }
                    s += extension;
                }

                return s;
            }

            return null;
        });

        return Path.changeExtension.apply(null, params);
    }

    /**
     * 将两个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @returns 包含合并的路径的字符串。如果指定的路径之一是零长度字符串，则该方法返回其他路径。如果 path2 包含绝对路径，则该方法返回 path2。
     * @throws path1 或 path2 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static combine(path1: string, path2: string): string;

    /**
     * 将三个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @param path3 要组合的第三个路径。
     * @returns 包含合并的路径的字符串。
     * @throws path1、path2 或 path3 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static combine(path1: string, path2: string, path3: string): string;

    /**
     * 将四个字符串组合成一个路径。
     * @param path1 要组合的第一个路径。
     * @param path2 要组合的第二个路径。
     * @param path3 要组合的第三个路径。
     * @param path4 要组合的第四个路径。
     * @returns 包含合并的路径的字符串。
     * @throws path1、path2、path3 或 path4 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static combine(path1: string, path2: string, path3: string, path4: string): string;

    /**
     * 将字符串数组组合成一个路径。
     * @param paths 由路径的各部分构成的数组。
     * @returns 包含合并的路径的字符串。
     * @throws 数组中的一个字符串包含 Path.getInvalidPathChars() 中定义的一个或多个无效字符。
     */
    public static combine(paths: string[] | List<string>): string;

    public static combine(...params: any): any {
        Path.combine = overload()
            .add([String, String], function (path1: string, path2: string): string {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path2);

                return Path.#combineNoChecks(path1, path2);
            })
            .add([String, String, String], function (path1: string, path2: string, path3: string): string {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path2);
                Path.#checkInvalidPathChars(path3);

                return Path.#combineNoChecks(Path.#combineNoChecks(path1, path2), path3);
            })
            .add([String, String, String, String], function (path1: string, path2: string, path3: string, path4: string): string {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path2);
                Path.#checkInvalidPathChars(path3);
                Path.#checkInvalidPathChars(path4);

                return Path.#combineNoChecks(Path.#combineNoChecks(Path.#combineNoChecks(path1, path2), path3), path4);
            })
            .add([[Array, List.T(String)]], function (paths: string[] | List<string>): string {
                const pathsArray = Array.isArray(paths) ? paths : paths.toArray();

                for (let i = 0; i < pathsArray.length; i++) {
                    if (typeof pathsArray[i] !== "string") {
                        throw new Error(`paths[${i}] 必须是字符串。`);
                    }
                }

                let finalSize = 0;
                let firstComponent = 0;

                for (let i = 0; i < pathsArray.length; i++) {
                    if (!pathsArray[i].length) {
                        continue;
                    }

                    Path.#checkInvalidPathChars(pathsArray[i]);

                    if (Path.#isPathRooted(pathsArray[i])) {
                        firstComponent = i;
                        finalSize = pathsArray[i].length;
                    } else {
                        finalSize += pathsArray[i].length;
                    }

                    const ch = pathsArray[i][pathsArray[i].length - 1];
                    if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch != Path.volumeSeparatorChar) {
                        finalSize++;
                    }
                }

                const finalPath = new StringBuilder();

                for (let i = firstComponent; i < pathsArray.length; i++) {
                    if (!pathsArray[i].length) {
                        continue;
                    }

                    if (!finalPath.length) {
                        finalPath.append(pathsArray[i]);
                    } else {
                        const ch = finalPath.toString()[finalPath.length - 1];
                        if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch != Path.volumeSeparatorChar) {
                            finalPath.append(Path.directorySeparatorChar);
                        }

                        finalPath.append(pathsArray[i]);
                    }
                }

                return finalPath.toString();
            });

        return Path.combine.apply(null, params);
    }

    /**
     * 返回指定路径字符串的目录信息。
     * @param path 文件或目录的路径。
     * @returns 包含 path 目录信息的 String；或者为 null（如果 path 表示根目录、是空字符串 ("") 或是 null）。如果 path 没有包含目录信息，则返回空白 String。
     * @throws path 参数包含无效字符、为空、或仅包含空白。
     */
    public static getDirectoryName(path: string | null): string | null;

    public static getDirectoryName(...params: any): any {
        Path.getDirectoryName = overload([[String, null]], function (path: string | null): string | null {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                const root = Path.#getRootLength(path);
                let i = path.length;
                if (i > root) {
                    i = path.length;
                    if (i === root) return "";
                    while (i > root && path[--i] !== Path.directorySeparatorChar && path[i] !== Path.altDirectorySeparatorChar);
                    const dir = path.substr(0, i);
                    return dir;
                }
            }

            return null;
        });

        return Path.getDirectoryName.apply(null, params);
    }

    /**
     * 返回指定的路径字符串的扩展名。
     * @param path 从其获取扩展名的路径字符串。
     * @returns 包含指定路径的扩展名（包括"."）的 String、null 或空白 String。如果 path 为 null，则 GetExtension 返回 null。如果 path 不具有扩展名信息，则 GetExtension 返回 Empty。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static getExtension(path: string | null): string | null;

    public static getExtension(...params: any): any {
        Path.getExtension = overload([[String, null]], function (path: string | null): string | null {
            if (path === null) return null;

            Path.#checkInvalidPathChars(path);
            const length = path.length;
            for (let i = length; --i >= 0;) {
                const ch = path[i];
                if (ch === ".") {
                    if (i != length - 1) {
                        return path.substr(i, length - i);
                    } else {
                        return "";
                    }
                }

                if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                    break;
                }
            }

            return "";
        });

        return Path.getExtension.apply(null, params);
    }

    /**
     * 返回指定路径字符串的文件名和扩展名。
     * @param path 从其获取文件名和扩展名的路径字符串。
     * @returns 一个 String，由 path 中最后的目录字符后的字符组成。如果 path 的最后一个字符是目录或卷分隔符，则此方法返回空白 String。如果 path 为 null，则此方法返回 null。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static getFileName(path: string | null): string | null;

    public static getFileName(...params: any): any {
        Path.getFileName = overload([[String, null]], function (path: string | null): string | null {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                const length = path.length;
                for (let i = length; --i >= 0;) {
                    const ch = path[i];
                    if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                        return path.substr(i + 1, length - i - 1);
                    }
                }
            }

            return path;
        });

        return Path.getFileName.apply(null, params);
    }

    /**
     * 返回不具有扩展名的指定路径字符串的文件名。
     * @param path 文件的路径。
     * @returns 包含由 Path.getFileName(String) 返回的字符串的 String，但不包括最后的句点 (.) 和该句点后的所有字符。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static getFileNameWithoutExtension(path: string): string;

    public static getFileNameWithoutExtension(...params: any): any {
        Path.getFileNameWithoutExtension = overload([String], function (path: string): string {
            const fileName = Path.getFileName(path);

            if (fileName) {
                const i = fileName.lastIndexOf(".");
                if (i === -1) {
                    return fileName;
                } else {
                    return fileName.substr(0, i);
                }
            }

            return "";
        });

        return Path.getFileNameWithoutExtension.apply(null, params);
    }

    /**
     * 返回指定路径字符串的绝对路径。
     * @param path 要为其获取绝对路径信息的文件或目录。
     * @returns 包含 path 的完全限定位置的字符串，例如"C:\MyFile.txt"。
     * @throws path 是一个零长度字符串，仅包含空白或者包含 Path.getInvalidPathChars() 中已定义一个或多个无效字符。- 或 -系统未能检索绝对路径。
     */
    public static getFullPath(path: string | null): string;

    public static getFullPath(...params: any): string {
        Path.getFullPath = overload([[String, null]], function (path: string | null): string {
            if (path === null || path.trim() === "") {
                throw new Error("路径不能为 null 或空。");
            }

            Path.#checkInvalidPathChars(path);

            // 检查通配符
            if (Path.#hasWildCardCharacters(path)) {
                throw new Error("路径包含通配符字符。");
            }

            let normalizedPath = Path.#normalizePath(path);

            // 如果已经是绝对路径，直接返回规范化的路径
            if (Path.#isPathRooted(normalizedPath)) {
                return normalizedPath;
            }

            // 对于相对路径，在Node.js环境中使用process.cwd()
            // 在浏览器环境中使用当前URL的基路径
            try {
                if (typeof process !== 'undefined' && process.cwd) {
                    // Node.js 环境
                    return Path.combine(process.cwd(), normalizedPath);
                } else {
                    // Web环境 - 使用当前URL的基路径
                    const currentPath = globalThis?.location?.href || "file:///";
                    return _FileHelper.resolveAbsolutePath(currentPath, normalizedPath);
                }
            } catch {
                // 如果无法解析，返回规范化的路径
                return normalizedPath;
            }
        });

        return Path.getFullPath.apply(null, params);
    }

    /**
     * 获取包含不允许在文件名中使用的字符的数组。
     * @returns 包含不允许在文件名中使用的字符的数组。
     */
    public static getInvalidFileNameChars(): readonly string[];

    public static getInvalidFileNameChars(...params: any): any {
        Path.getInvalidFileNameChars = overload([], function (): readonly string[] {
            return Path.#invalidFileNameChars;
        });

        return Path.getInvalidFileNameChars.apply(null, params);
    }

    /**
     * 获取包含不允许在路径名中使用的字符的数组。
     * @returns 包含不允许在路径名中使用的字符的数组。
     */
    public static getInvalidPathChars(): readonly string[];

    public static getInvalidPathChars(...params: any): any {
        Path.getInvalidPathChars = overload([], function (): readonly string[] {
            return Path.invalidPathChars;
        });

        return Path.getInvalidPathChars.apply(null, params);
    }

    /**
     * 获取指定路径的根目录信息。
     * @param path 从其获取根目录信息的路径。
     * @returns 一个包含 path 的根目录的字符串，例如"C:\"；如果 path 为 null，则为 null；如果 path 不包含根目录信息，则为空字符串。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。- 或空白 String 被传递到 path。
     */
    public static getPathRoot(path: string | null): string;

    public static getPathRoot(...params: any): any {
        Path.getPathRoot = overload([[String, null]], function (path: string | null): string {
            if (path === null) return "";

            const normalizedPath = Path.#normalizePath(path);
            return normalizedPath.substr(0, Path.#getRootLength(normalizedPath));
        });

        return Path.getPathRoot.apply(null, params);
    }

    /**
     * 返回随机文件夹名或文件名。
     * @returns 随机文件夹名或文件名。
     */
    public static getRandomFileName(): string;

    public static getRandomFileName(...params: any): any {
        Path.getRandomFileName = overload([], function (): string {
            let filename = "";
            for (let i = 12; i--;) {
                if (i === 3) {
                    filename += ".";
                    continue;
                }
                const index = Math.floor(Math.random() * (Path.#randomChars.length));
                filename += Path.#randomChars[index];
            }

            return filename;
        });

        return Path.getRandomFileName.apply(null, params);
    }

    /**
     * 在磁盘上创建具有唯一名称的零字节临时文件并返回该文件的完整路径。
     * @returns 临时文件的完整路径。
     */
    public static getTempFileName(): string;

    public static getTempFileName(...params: any): any {
        Path.getTempFileName = overload([], function (): string {
            const tempPath = Path.getTempPath();
            const tempFileName = Path.getRandomFileName();
            const fullPath = Path.combine(tempPath, tempFileName);
            // 在真实的文件系统环境中，这里应该创建文件并确保唯一性
            // 但在Web环境中我们只返回路径
            return fullPath;
        });

        return Path.getTempFileName.apply(null, params);
    }

    /**
     * 返回当前系统的临时文件夹的路径。
     * @returns 包含临时目录的路径信息的 String。
     */
    public static getTempPath(): string;

    public static getTempPath(...params: any): any {
        Path.getTempPath = overload([], function (): string {
            // 在Windows环境下应该返回 %TEMP% 或 %TMP%
            // 在Web环境中我们使用一个合理的默认值
            if (typeof process !== 'undefined' && process.env) {
                return process.env.TEMP || process.env.TMP || "C:\\temp";
            }
            return _FileHelper.resolveAbsolutePath(globalThis?.location?.href || "", "./temp");
        });

        return Path.getTempPath.apply(null, params);
    }

    /**
     * 确定路径是否包括文件扩展名。
     * @param path 用于搜索扩展名的路径。
     * @returns 如果路径中最后的目录分隔符（\\ 或 /）或卷分隔符 (:) 之后的字符包括句点 (.)，并且后面跟有一个或多个字符，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static hasExtension(path: string | null): boolean;

    public static hasExtension(...params: any): any {
        Path.hasExtension = overload([[String, null]], function (path: string | null): boolean {
            if (path === null) {
                Path.#checkInvalidPathChars("");
                return false;
            }

            Path.#checkInvalidPathChars(path);

            for (let i = path.length; --i >= 0;) {
                const ch = path[i];
                if (ch == ".") {
                    if (i != path.length - 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                    break;
                }
            }

            return false;
        });

        return Path.hasExtension.apply(null, params);
    }

    /**
     * 获取路径的最大允许长度。
     * @returns 路径的最大允许长度。
     */
    public static getMaxPathLength(): number;

    public static getMaxPathLength(...params: any): any {
        Path.getMaxPathLength = overload([], function (): number {
            return Path.#MAX_PATH;
        });

        return Path.getMaxPathLength.apply(null, params);
    }

    /**
     * 获取目录路径的最大允许长度。
     * @returns 目录路径的最大允许长度。
     */
    public static getMaxDirectoryPathLength(): number;

    public static getMaxDirectoryPathLength(...params: any): any {
        Path.getMaxDirectoryPathLength = overload([], function (): number {
            return Path.#MAX_DIRECTORY_PATH;
        });

        return Path.getMaxDirectoryPathLength.apply(null, params);
    }

    /**
     * 检查路径是否包含通配符字符（* 或 ?）。
     * @param path 要检查的路径。
     * @returns 如果路径包含通配符则返回 true，否则返回 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static hasWildCardCharacters(path: string | null): boolean;

    public static hasWildCardCharacters(...params: any): boolean {
        Path.hasWildCardCharacters = overload([[String, null]], function (path: string | null): boolean {
            if (path === null) {
                return false;
            }

            Path.#checkInvalidPathChars(path);
            return Path.#hasWildCardCharacters(path);
        });

        return Path.hasWildCardCharacters.apply(null, params);
    }

    /**
     * 获取一个值，该值指示指定的路径字符串是包含绝对路径信息还是包含相对路径信息。
     * @param path 要测试的路径。
     * @returns 如果 path 包含绝对路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static isPathRooted(path: string | null): boolean;

    public static isPathRooted(...params: any): boolean {
        Path.isPathRooted = overload([[String, null]], function (path: string | null): boolean {
            if (path === null) {
                return false;
            }

            Path.#checkInvalidPathChars(path);

            const length = path.length;
            if ((length >= 1 && (path[0] === Path.directorySeparatorChar || path[0] === Path.altDirectorySeparatorChar)) || (length >= 2 && path[1] === Path.volumeSeparatorChar)) {
                return true;
            }

            return false;
        });

        return Path.isPathRooted.apply(null, params);
    }

    /**
     * 获取一个值，该值指示指定的路径字符串是否为UNC（通用命名约定）路径。
     * @param path 要测试的路径。
     * @returns 如果 path 是UNC路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static isUncPath(path: string | null): boolean;

    public static isUncPath(...params: any): boolean {
        Path.isUncPath = overload([[String, null]], function (path: string | null): boolean {
            if (path === null) {
                return false;
            }

            Path.#checkInvalidPathChars(path);
            return Path.#isUnc(path) || Path.#isExtendedUnc(path);
        });

        return Path.isUncPath.apply(null, params);
    }

    /**
     * 获取一个值，该值指示指定的路径字符串是否为设备路径。
     * @param path 要测试的路径。
     * @returns 如果 path 是设备路径，则为 true；否则为 false。
     * @throws path 包含 Path.getInvalidPathChars() 中已定义的一个或多个无效字符。
     */
    public static isDevicePath(path: string | null): boolean;

    public static isDevicePath(...params: any): boolean {
        Path.isDevicePath = overload([[String, null]], function (path: string | null): boolean {
            if (path === null) {
                return false;
            }

            Path.#checkInvalidPathChars(path);
            return Path.#isDevicePath(path);
        });

        return Path.isDevicePath.apply(null, params);
    }
}
