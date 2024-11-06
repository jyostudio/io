import overload from "@jyostudio/overload";
import List from "@jyostudio/list";
import { StringBuilder } from "@jyostudio/text";
import FileHelper from "./fileHelper.js";

export default class Path {
    static get #extendedPathPrefix() {
        return "\\\\?\\";
    }

    static get #uncPathPrefix() {
        return "\\\\";
    }

    static get #uncExtendedPrefixToInsert() {
        return "?\\UNC\\";
    }

    static get #uncExtendedPathPrefix() {
        return "\\\\?\\UNC\\";
    }

    static get #devicePathPrefix() {
        return "\\\\.\\";
    }

    static get #devicePrefixLength() {
        return 4;
    }

    static get #maxPath() {
        return 260;
    }

    static get #maxDirectoryLength() {
        return 255;
    }

    static get #MAX_PATH() {
        return 260;
    }

    static get #MAX_DIRECTORY_PATH() {
        return 248;
    }

    static get pathSeparator() {
        return ";";
    }

    static #directorySeparatorCharAsString = "\\";
    static get directorySeparatorChar() {
        return "\\";
    }

    static get altDirectorySeparatorChar() {
        return "/";
    }

    static get volumeSeparatorChar() {
        return ":";
    }

    static #randomCharsReal = null;
    static get #randomChars() {
        if (!this.#randomCharsReal) {
            this.#randomCharsReal = "abcdefghijklmnopqrstuvwxyz1234567890";
        }

        return this.#randomCharsReal;
    }

    static #invalidPathCharsWithAdditionalChecksReal = null;
    static get #invalidPathCharsWithAdditionalChecks() {
        if (!this.#invalidPathCharsWithAdditionalChecksReal) {
            let invalidChars = "\"<>|\0*?".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(i.toString());
            }
            this.#invalidPathCharsWithAdditionalChecksReal = new Proxy(invalidChars, {
                get(obj, prop) {
                    return obj[prop];
                },
                set() {
                    throw new Error("Cant modify read-only property.");
                }
            });
        }
        return this.#invalidPathCharsWithAdditionalChecksReal;
    }

    static #invalidPathCharsReal = null;
    static get invalidPathChars() {
        if (!this.#invalidPathCharsReal) {
            let invalidChars = "\"<>|\0".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(i.toString());
            }
            this.#invalidPathCharsReal = new Proxy(invalidChars, {
                get(obj, prop) {
                    return obj[prop];
                },
                set() {
                    throw new Error("Cant modify read-only property.");
                }
            });
        }
        return this.#invalidPathCharsReal;
    }

    static #invalidFileNameCharsReal = null;
    static get #invalidFileNameChars() {
        if (!this.#invalidFileNameCharsReal) {
            let invalidChars = "\"<>|\0:*?\\/".split("");
            for (let i = 1; i <= 31; i++) {
                invalidChars.push(i.toString());
            }
            this.#invalidFileNameCharsReal = new Proxy(invalidChars, {
                get(obj, prop) {
                    return obj[prop];
                },
                set() {
                    throw new Error("Cant modify read-only property.");
                }
            });
        }
        return this.#invalidFileNameCharsReal;
    }

    static #checkInvalidPathChars = function (...params) {
        Path.#checkInvalidPathChars = overload()
            .add([String], function (path) {
                return Path.#checkInvalidPathChars(path, false);
            })
            .add([String, Boolean], function (path, checkAdditional) {
                if (Path.#hasIllegalCharacters(path, checkAdditional)) {
                    throw new Error("Invalid path characters.");
                }
            });

        return Path.#checkInvalidPathChars.apply(this, params);
    }

    static #hasIllegalCharacters = function (...params) {
        Path.#hasIllegalCharacters = overload()
            .add([String], function (path) {
                return Path.#hasIllegalCharacters.call(this, path, false);
            })
            .add([String, Boolean], function (path, checkAdditional) {
                if (Path.#isDevice(path)) {
                    return false;
                }

                return Path.#andPathHasIllegalCharacters(path, checkAdditional);
            });

        return Path.#hasIllegalCharacters.apply(this, params);
    }

    static #andPathHasIllegalCharacters = function (...params) {
        Path.#andPathHasIllegalCharacters = overload()
            .add([String], function (path) {
                return Path.#andPathHasIllegalCharacters.call(this, path, false);
            })
            .add([String, Boolean], function (path, checkAdditional) {
                return path.indexOf(Path.invalidPathChars) >= 0 || (checkAdditional && Path.#anyPathHasWildCardCharacters(path));
            });

        return Path.#andPathHasIllegalCharacters.apply(this, params);
    }

    static #hasWildCardCharacters = function (...params) {
        Path.#hasWildCardCharacters = overload([String], function (path) {
            const startIndex = Path.#isDevice(path) ? Path.#extendedPathPrefix.length : 0;
            return Path.#anyPathHasWildCardCharacters(path, startIndex);
        });

        return Path.#hasWildCardCharacters.apply(this, params);
    }

    static #anyPathHasWildCardCharacters = function (...params) {
        Path.#anyPathHasWildCardCharacters = overload()
            .add([String], function (path) {
                return Path.#anyPathHasWildCardCharacters.call(this, path, 0);
            })
            .add([String, Number], function (path, startIndex) {
                let currentChar;
                for (let i = startIndex; i < path.length; i++) {
                    currentChar = path[i];
                    if (currentChar === "*" || currentChar === "?") {
                        return true;
                    }
                }

                return false;
            });

        return Path.#anyPathHasWildCardCharacters.apply(this, params);
    }

    static #isDirectorySeparator = function (...params) {
        Path.#isDirectorySeparator = overload([String], function (c) {
            return (c === Path.#directorySeparatorCharAsString || c === Path.altDirectorySeparatorChar);
        });

        return Path.#isDirectorySeparator.apply(this, params);
    }

    static #isDevice = function (...params) {
        Path.#isDevice = overload([[String, StringBuilder]], function (path) {
            return Path.#isExtended(path) || (
                path.length > Path.#devicePrefixLength
                && Path.#isDirectorySeparator(path[0])
                && Path.#isDirectorySeparator(path[1])
                && (path[2] == "." || path[2] == "?")
                && Path.#isDirectorySeparator(path[3])
            );
        });

        return Path.#isDevice.apply(this, params);
    }

    static #isExtended = function (...params) {
        Path.#isExtended = overload([[String, StringBuilder]], function (path) {
            return path.length >= Path.#devicePrefixLength
                && path[0] === "\\"
                && (path[1] === "\\" || path[1] === "?")
                && path[2] === "?"
                && path[3] === "\\";
        });

        return Path.#isExtended.apply(this, params);
    }

    static #isExtendedUnc = function (...params) {
        Path.#isExtendedUnc = overload([[String, StringBuilder]], function (path) {
            return path.length >= Path.#uncExtendedPathPrefix.length
                && Path.#isExtended(path)
                && path[4].toUpperCase() === "U"
                && path[5].toUpperCase() === "U"
                && path[6].toUpperCase() === "U"
                && path[7] === "\\";
        });

        return Path.#isExtendedUnc.apply(this, params);
    }

    static #isPathRooted = function (...params) {
        Path.#isPathRooted = overload([[String, null]], function (path) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let length = path.length;
                if ((length >= 1 && (path[0] === Path.directorySeparatorChar || path[0] === Path.altDirectorySeparatorChar)) || (length >= 2 && path[1] === Path.volumeSeparatorChar)) {
                    return true;
                }
            }

            return false;
        });

        return Path.#isPathRooted.apply(this, params);
    }

    static #isValidDriveChar = function (...params) {
        Path.#isValidDriveChar = overload([String], function (value) {
            return ((value >= "A" && value <= "Z") || (value >= "a" && value <= "z"));
        });

        return Path.#isValidDriveChar.apply(this, params);
    }

    static #combineNoChecks = function (...params) {
        Path.#combineNoChecks = overload([String, String], function (path1, path2) {
            if (!path2.length) {
                return path1;
            }

            if (!path1.length) {
                return path2;
            }

            if (Path.#isPathRooted(path2)) {
                return path2;
            }

            let ch = path1[path1.length - 1];
            if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch !== Path.volumeSeparatorChar) {
                return path1 + Path.#directorySeparatorCharAsString + path2;
            }

            return path1 + path2;
        });

        return Path.#combineNoChecks.apply(this, params);
    }

    static #startsWithOrdinal = function (...params) {
        Path.#startsWithOrdinal = overload([String, Number, String], function (source, sourceLength, value) {
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

        return Path.#startsWithOrdinal.apply(this, params);
    }

    static #getRootLength = function (...params) {
        Path.#getRootLength = overload([String], function (path) {
            Path.#checkInvalidPathChars(path);

            let i = 0;
            let volumeSeparatorLength = 2;
            let uncRootLength = 2;

            let extendedSyntax = Path.#startsWithOrdinal(path, path.length, Path.#extendedPathPrefix);
            let extendedUncSyntax = Path.#startsWithOrdinal(path, path.length, Path.#uncExtendedPathPrefix);

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

        return Path.#getRootLength.apply(this, params);
    }

    static #pathStartSkip = function (...params) {
        Path.#pathStartSkip = overload([String], function (path) {
            let startIndex = 0;
            while (startIndex < path.length && path[startIndex] === ' ') {
                startIndex++;
            }

            if (startIndex > 0 && (startIndex < path.length && Path.#isDirectorySeparator(path[startIndex]))
                || (startIndex + 1 < path.length && path[startIndex + 1] === Path.volumeSeparatorChar && Path.#isValidDriveChar(path[startIndex]))) {
                return startIndex;
            }

            return 0;
        });

        return Path.#pathStartSkip.apply(this, params);
    }

    static #normalizeDirectorySeparators = function (...params) {
        Path.#normalizeDirectorySeparators = overload([String], function (path) {
            if (!path.trim()) {
                return path;
            }

            let current;
            let start = Path.#pathStartSkip(path);

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

            let builder = new StringBuilder();

            if (Path.#isDirectorySeparator(path[start])) {
                start++;
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

        return Path.#normalizeDirectorySeparators.apply(this, params);
    }

    static #newNormalizePathLimitedChecks = function (...params) {
        Path.#newNormalizePathLimitedChecks = overload([String], function (path) {
            let normalized = Path.#normalizeDirectorySeparators(path);

            return normalized;
        });

        return Path.#newNormalizePathLimitedChecks.apply(this, params);
    }

    static #normalizePath = function (...params) {
        Path.#normalizePath = overload([String], function (path) {
            if (Path.#isExtended(path)) {
                return path;
            }

            let normalizedPath = Path.#newNormalizePathLimitedChecks(path);

            if (!normalizedPath.trim()) {
                throw new Error("path is empty.");
            }

            return normalizedPath;
        });

        return Path.#normalizePath.apply(this, params);
    }

    static changeExtension(...params) {
        Path.changeExtension = overload([[String, null], [String, null]], function (path, extension) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let s = path;
                for (let i = path.length; --i >= 0;) {
                    let ch = path[i];
                    if (ch === ".") {
                        s = path.substr(0, i);
                        break;
                    }
                    if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                        break;
                    }
                }

                if (extension !== null && path.length != 0) {
                    if (extension.length != 0 || extension[0] != ".") {
                        s += ".";
                    }
                    s += extension;
                }

                return s;
            }

            return "";
        });

        return Path.changeExtension.apply(this, params);
    }

    static combine(...params) {
        Path.combine = overload()
            .add([String, String], function (path1, path2) {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path2);

                return Path.#combineNoChecks(path1, path2);
            })
            .add([String, String, String], function (path1, path2, path3) {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path2);
                Path.#checkInvalidPathChars(path3);

                return Path.#combineNoChecks(Path.#combineNoChecks(path1, path2), path3);
            })
            .add([String, String, String, String], function (path1, path2, path3, path4) {
                Path.#checkInvalidPathChars(path1);
                Path.#checkInvalidPathChars(path3);

                return Path.#combineNoChecks(Path.#combineNoChecks(Path.#combineNoChecks(path1, path2), path3), path4);
            })
            .add([[Array, List.T(String)]], function (paths) {
                for (let i = 0; i < paths.length; i++) {
                    if (typeof paths[i] !== "string") {
                        throw new Error(`paths[${i}] is not a string.`);
                    }
                }

                let finalSize = 0;
                let firstComponent = 0;

                for (let i = 0; i < paths.Count; i++) {
                    if (!paths[i].length) {
                        continue;
                    }

                    Path.#checkInvalidPathChars(paths[i]);

                    if (Path.#isPathRooted(paths[i])) {
                        firstComponent = i;
                        finalSize = paths[i].length;
                    } else {
                        finalSize += paths[i].length;
                    }

                    let ch = paths[i][paths[i].length - 1];
                    if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch != Path.volumeSeparatorChar) {
                        finalSize++;
                    }
                }

                let finalPath = new StringBuilder();

                for (let i = firstComponent; i < paths.length; i++) {
                    if (!paths[i].length) {
                        continue;
                    }

                    if (!finalPath.length) {
                        finalPath.append(paths[i]);
                    } else {
                        let ch = finalPath[finalPath.length - 1];
                        if (ch !== Path.directorySeparatorChar && ch !== Path.altDirectorySeparatorChar && ch != Path.volumeSeparatorChar) {
                            finalPath.append(Path.directorySeparatorChar);
                        }

                        finalPath.append(paths[i]);
                    }
                }

                return finalPath.toString();
            });

        return Path.combine.apply(this, params);
    }

    static getDirectoryName(...params) {
        Path.getDirectoryName = overload([[String, null]], function (path) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let root = Path.#getRootLength(path);
                let i = path.length;
                if (i > root) {
                    i = path.length;
                    if (i === root) return "";
                    while (i > root && path[--i] !== Path.directorySeparatorChar && path[i] !== Path.altDirectorySeparatorChar);
                    let dir = path.substr(0, i);
                    return dir;
                }
            }

            return "";
        });

        return Path.getDirectoryName.apply(this, params);
    }

    static getExtension(...params) {
        Path.getExtension = overload([[String, null]], function (path) {
            if (path === null) return "";

            Path.#checkInvalidPathChars(path);
            let length = path.length;
            for (let i = length; --i >= 0;) {
                let ch = path[i];
                if (ch === ".") {
                    if (i != length - 1) {
                        return path.substr(i, length - 1);
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

        return Path.getExtension.apply(this, params);
    }

    static getFileName(...params) {
        Path.getFileName = overload([[String, null]], function (path) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let length = path.length;
                for (let i = length; --i >= 0;) {
                    let ch = path[i];
                    if (ch === Path.directorySeparatorChar || ch === Path.altDirectorySeparatorChar || ch === Path.volumeSeparatorChar) {
                        return path.substr(i + 1, length - i - 1);
                    }
                }
            }

            return path;
        });

        return Path.getFileName.apply(this, params);
    }

    static getFileNameWithoutExtension(...params) {
        Path.getFileNameWithoutExtension = overload([String], function (path) {
            path = Path.getFileName(path);

            if (path) {
                let i;
                if ((i = path.lastIndexOf('.')) === -1) {
                    return path;
                } else {
                    return path.substr(0, i);
                }
            }

            return "";
        });

        return Path.getFileNameWithoutExtension.apply(this, params);
    }

    static getFullPath(...params) {
        Path.getFullPath = overload([[String, null]], function (path) {
            if (path !== null) {
                Path.#checkInvalidPathChars(path);

                let normalizedPath = Path.#normalizePath(path);

                if (path.length > 0) {
                    try {
                        let tempPath = path;

                        let pos = 0;
                        while (pos < tempPath.length && (tempPath[pos] !== '?' && tempPath[pos] !== '*')) {
                            pos++;
                        }

                        if (pos > 0) {
                            Path.getFullPath(tempPath.substr(0, pos));
                        }
                    } catch {
                        normalizedPath = Path.#normalizePath(path);
                    }
                }

                path = normalizedPath;

                let root = Path.#getRootLength(path);
                let i = path.length;
                if (i > root) {
                    i = path.length;
                    if (i === root) return "";
                    while (i > root && path[--i] !== Path.directorySeparatorChar && path[i] !== Path.altDirectorySeparatorChar);
                    let dir = path.substr(0, i);
                    return dir;
                }
            }

            return "";
        });

        return Path.getFullPath.apply(this, params);
    }

    static getInvalidFileNameChars(...params) {
        Path.getInvalidFileNameChars = overload([], function () {
            return Path.#invalidFileNameChars;
        });

        return Path.getInvalidFileNameChars.apply(this, params);
    }

    static getInvalidPathChars(...params) {
        Path.getInvalidPathChars = overload([], function () {
            return Path.invalidPathChars;
        });

        return Path.getInvalidPathChars.apply(this, params);
    }

    static getPathRoot(...params) {
        Path.getPathRoot = overload([[String, null]], function (path) {
            if (path === null) return "";

            path = Path.#normalizePath(path);
            return path.substr(0, Path.#getRootLength(path));
        });

        return Path.getPathRoot.apply(this, params);
    }

    static getRandomFileName(...params) {
        Path.getRandomFileName = overload([], function () {
            let filename = "";
            for (let i = 12; i--;) {
                if (i === 3) {
                    filename += '.';
                    continue;
                }
                let index = Math.floor(Math.random() * (Path.#randomChars.length));
                filename += Path.#randomChars[index];
            }

            return filename;
        });

        return Path.getRandomFileName.apply(this, params);
    }

    static getTempPath(...params) {
        Path.getTempPath = overload([], function () {
            return FileHelper.resolveAbsolutePath(globalThis?.location?.href || "", "./temp");
        });

        return Path.getTempPath.apply(this, params);
    }

    static hasExtension(...params) {
        Path.hasExtension = overload([[String, null]], function (path) {
            Path.#checkInvalidPathChars(path);

            if (path !== null) {
                for (let i = path.length; --i >= 0;) {
                    let ch = path[i];
                    if (ch == '.') {
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
            }

            return false;
        });

        return Path.hasExtension.apply(this, params);
    }

    static isPathRooted(...params) {
        Path.isPathRooted = overload([[String, null]], function (path) {
            Path.#checkInvalidPathChars(path);

            if (path !== null) {
                let length = path.length;
                if ((length >= 1 && (path[0] === Path.directorySeparatorChar || path[0] === Path.altDirectorySeparatorChar)) || (length >= 2 && path[1] === Path.volumeSeparatorChar)) {
                    return true;
                }
            }

            return false;
        });

        return Path.isPathRooted.apply(this, params);
    }
}
