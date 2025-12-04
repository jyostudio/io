import { describe, it, expect } from "../runner";
import { StringReader } from "../../src/index";

describe("StringReader 类测试", () => {
    it("read 应该逐字符读取", () => {
        const reader = new StringReader("abc");
        expect(reader.read()).toBe("a".charCodeAt(0));
        expect(reader.read()).toBe("b".charCodeAt(0));
        expect(reader.read()).toBe("c".charCodeAt(0));
        expect(reader.read()).toBe(-1);
    });

    it("read (buffer) 应该读取到缓冲区", () => {
        const reader = new StringReader("abcde");
        const buffer = new Array<string>(3);
        const count = reader.read(buffer, 0, 3);
        
        expect(count).toBe(3);
        expect(buffer[0]).toBe("a");
        expect(buffer[2]).toBe("c");
        
        const count2 = reader.read(buffer, 0, 3);
        expect(count2).toBe(2); // de
        expect(buffer[0]).toBe("d");
        expect(buffer[1]).toBe("e");
    });

    it("peek 应该不消耗字符", () => {
        const reader = new StringReader("abc");
        expect(reader.peek()).toBe("a".charCodeAt(0));
        expect(reader.read()).toBe("a".charCodeAt(0));
    });

    it("readToEnd 应该读取剩余所有字符", () => {
        const reader = new StringReader("abc");
        reader.read(); // consume 'a'
        expect(reader.readToEnd()).toBe("bc");
        expect(reader.readToEnd()).toBe("");
    });

    it("readLine 应该逐行读取", () => {
        const reader = new StringReader("line1\r\nline2\nline3");
        expect(reader.readLine()).toBe("line1");
        expect(reader.readLine()).toBe("line2");
        expect(reader.readLine()).toBe("line3");
        expect(reader.readLine()).toBe(null);
    });

    it("close 应该重置状态", () => {
        const reader = new StringReader("abc");
        reader.close();
        
        let errorThrown = false;
        try {
            reader.read();
        } catch {
            errorThrown = true;
        }
        expect(errorThrown).toBe(true);
    });
});
