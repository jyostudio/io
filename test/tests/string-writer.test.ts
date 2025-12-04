import { describe, it, expect } from "../runner";
import { StringWriter } from "../../src/index";
import { StringBuilder } from "@jyostudio/text";

describe("StringWriter 类测试", () => {
    it("构造函数应该正确初始化", () => {
        const sw1 = new StringWriter();
        expect(sw1.toString()).toBe("");

        const sb = new StringBuilder("Initial");
        const sw2 = new StringWriter(sb);
        expect(sw2.toString()).toBe("Initial");
    });

    it("write 应该写入字符串", () => {
        const writer = new StringWriter();
        writer.write("Hello");
        writer.write(" ");
        writer.write("World");
        expect(writer.toString()).toBe("Hello World");
    });

    it("writeLine 应该写入换行符", () => {
        const writer = new StringWriter();
        writer.newLine = "\n";
        writer.writeLine("Line 1");
        writer.write("Line 2");
        expect(writer.toString()).toBe("Line 1\nLine 2");
    });

    it("write (boolean) 应该写入 True/False", () => {
        const writer = new StringWriter();
        writer.write(true);
        writer.write(false);
        expect(writer.toString()).toBe("TrueFalse");
    });

    it("write (number) 应该写入数字字符串", () => {
        const writer = new StringWriter();
        writer.write(123);
        expect(writer.toString()).toBe("123");
    });

    it("write (object) 应该写入对象字符串", () => {
        const writer = new StringWriter();
        const obj = { toString: () => "Obj" };
        writer.write(obj);
        expect(writer.toString()).toBe("Obj");
    });

    it("write (Uint8Array) 应该写入字符", () => {
        const writer = new StringWriter();
        const buffer = new Uint8Array([65, 66]); // A, B
        writer.write(buffer);
        expect(writer.toString()).toBe("AB");
    });

    it("write (string[]) 应该写入字符数组", () => {
        const writer = new StringWriter();
        writer.write(["A", "B"]);
        expect(writer.toString()).toBe("AB");
    });

    it("write (string[], index, count) 应该写入部分字符数组", () => {
        const writer = new StringWriter();
        writer.write(["A", "B", "C"], 1, 1);
        expect(writer.toString()).toBe("B");
    });
    
    it("writeLine (overloads) 应该正常工作", () => {
        const writer = new StringWriter();
        writer.newLine = "\n";
        
        writer.writeLine(true);
        expect(writer.toString()).toBe("True\n");
        
        const sb = writer.getStringBuilder();
        sb.clear();
        
        writer.writeLine(123);
        expect(writer.toString()).toBe("123\n");
        
        sb.clear();
        writer.writeLine(["A", "B"]);
        expect(writer.toString()).toBe("AB\n");
    });

    it("getStringBuilder 应该返回内部 StringBuilder", () => {
        const writer = new StringWriter();
        writer.write("test");
        const sb = writer.getStringBuilder();
        expect(sb.toString()).toBe("test");
        sb.append("123");
        expect(writer.toString()).toBe("test123");
    });

    it("close 应该释放资源", () => {
        const writer = new StringWriter();
        writer.close();
        
        let errorThrown = false;
        try {
            writer.write("test");
        } catch {
            errorThrown = true;
        }
        expect(errorThrown).toBe(true);
    });
});
