import { describe, it, expect } from "../runner";
import { Path } from "../../src/index";
import List from "@jyostudio/list";

describe("Path 类测试", () => {
    it("combine 应该正确合并路径", () => {
        expect(Path.combine("a", "b")).toBe("a\\b");
        expect(Path.combine("a\\", "b")).toBe("a\\b");
        expect(Path.combine("a", "\\b")).toBe("\\b"); // b is rooted
        expect(Path.combine("C:\\", "b")).toBe("C:\\b");
        
        // 3 args
        expect(Path.combine("a", "b", "c")).toBe("a\\b\\c");
        
        // 4 args
        expect(Path.combine("a", "b", "c", "d")).toBe("a\\b\\c\\d");
        
        // Array args
        expect(Path.combine(["a", "b", "c"])).toBe("a\\b\\c");
        
        // List args
        const list = new List(String);
        list.add("a");
        list.add("b");
        expect(Path.combine(list)).toBe("a\\b");
    });

    it("getDirectoryName 应该返回目录名", () => {
        expect(Path.getDirectoryName("C:\\a\\b.txt")).toBe("C:\\a");
        expect(Path.getDirectoryName("C:\\a\\")).toBe("C:\\a");
        expect(Path.getDirectoryName("file.txt")).toBe("");
        expect(Path.getDirectoryName(null)).toBe(null);
    });

    it("getExtension 应该返回扩展名", () => {
        expect(Path.getExtension("file.txt")).toBe(".txt");
        expect(Path.getExtension("file.tar.gz")).toBe(".gz");
        expect(Path.getExtension("file")).toBe("");
        expect(Path.getExtension(null)).toBe(null);
    });

    it("getFileName 应该返回文件名", () => {
        expect(Path.getFileName("C:\\a\\b.txt")).toBe("b.txt");
        expect(Path.getFileName("C:\\a\\")).toBe("");
        expect(Path.getFileName("file.txt")).toBe("file.txt");
        expect(Path.getFileName(null)).toBe(null);
    });

    it("getFileNameWithoutExtension 应该返回无扩展名的文件名", () => {
        expect(Path.getFileNameWithoutExtension("C:\\a\\b.txt")).toBe("b");
        expect(Path.getFileNameWithoutExtension("file.tar.gz")).toBe("file.tar");
        expect(Path.getFileNameWithoutExtension("file")).toBe("file");
    });

    it("changeExtension 应该更改扩展名", () => {
        expect(Path.changeExtension("file.txt", ".dat")).toBe("file.dat");
        expect(Path.changeExtension("file.txt", "dat")).toBe("file.dat");
        expect(Path.changeExtension("file", ".txt")).toBe("file.txt");
        expect(Path.changeExtension("file.txt", null)).toBe("file");
        expect(Path.changeExtension(null, ".txt")).toBe(null);
    });

    it("isPathRooted 应该正确判断绝对路径", () => {
        expect(Path.isPathRooted("C:\\a")).toBe(true);
        expect(Path.isPathRooted("\\a")).toBe(true);
        expect(Path.isPathRooted("a\\b")).toBe(false);
        expect(Path.isPathRooted(null)).toBe(false);
    });

    it("hasExtension 应该正确判断是否有扩展名", () => {
        expect(Path.hasExtension("file.txt")).toBe(true);
        expect(Path.hasExtension("file")).toBe(false);
        expect(Path.hasExtension(null)).toBe(false);
    });

    it("getFullPath 应该返回绝对路径", () => {
        // 在浏览器环境中，这通常基于当前 URL 或模拟的 cwd
        const fullPath = Path.getFullPath("file.txt");
        // 在 Web 环境下，它可能返回 URL，Path.isPathRooted 可能返回 false
        const isRooted = Path.isPathRooted(fullPath) || fullPath.indexOf("://") > 0;
        expect(isRooted).toBe(true);
        expect(fullPath.endsWith("file.txt")).toBe(true);
    });

    it("getPathRoot 应该返回根目录", () => {
        expect(Path.getPathRoot("C:\\Windows\\System32")).toBe("C:\\");
        expect(Path.getPathRoot("\\\\server\\share\\dir")).toBe("\\\\server\\share");
        expect(Path.getPathRoot("file.txt")).toBe("");
        expect(Path.getPathRoot(null)).toBe("");
    });

    it("getRandomFileName 应该返回随机文件名", () => {
        const name1 = Path.getRandomFileName();
        const name2 = Path.getRandomFileName();
        expect(name1.length).toBeGreaterThan(0);
        expect(name1).not.toBe(name2);
    });

    it("getTempFileName 应该返回临时文件名", () => {
        const tempFile = Path.getTempFileName();
        const isRooted = Path.isPathRooted(tempFile) || tempFile.indexOf("://") > 0;
        expect(isRooted).toBe(true);
    });

    it("getTempPath 应该返回临时路径", () => {
        const tempPath = Path.getTempPath();
        expect(tempPath.length).toBeGreaterThan(0);
    });

    it("hasWildCardCharacters 应该检测通配符", () => {
        expect(Path.hasWildCardCharacters("file*.txt")).toBe(true);
        expect(Path.hasWildCardCharacters("file?.txt")).toBe(true);
        expect(Path.hasWildCardCharacters("file.txt")).toBe(false);
        expect(Path.hasWildCardCharacters(null)).toBe(false);
    });

    it("isUncPath 应该检测 UNC 路径", () => {
        expect(Path.isUncPath("\\\\server\\share")).toBe(true);
        expect(Path.isUncPath("C:\\file")).toBe(false);
        expect(Path.isUncPath(null)).toBe(false);
    });

    it("isDevicePath 应该检测设备路径", () => {
        expect(Path.isDevicePath("\\\\.\\COM1")).toBe(true);
        expect(Path.isDevicePath("C:\\file")).toBe(false);
        expect(Path.isDevicePath(null)).toBe(false);
    });

    it("getInvalidFileNameChars 应该返回无效字符", () => {
        const chars = Path.getInvalidFileNameChars();
        expect(chars.length).toBeGreaterThan(0);
        expect(chars.indexOf('"')).toBeGreaterThan(-1);
    });

    it("getInvalidPathChars 应该返回无效字符", () => {
        const chars = Path.getInvalidPathChars();
        expect(chars.length).toBeGreaterThan(0);
        expect(chars.indexOf('|')).toBeGreaterThan(-1);
    });
});
