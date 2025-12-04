import { describe, it, expect } from "../runner";
import { MemoryStream, BinaryReader, BinaryWriter, SeekOrigin } from "../../src/index";
import { UTF8Encoding } from "@jyostudio/text";

describe("BinaryReader 类测试", () => {
    it("构造函数应该正确初始化", () => {
        const ms = new MemoryStream();
        const reader1 = new BinaryReader(ms);
        expect(reader1.baseStream).toBe(ms);

        const reader2 = new BinaryReader(ms, new UTF8Encoding());
        expect(reader2.baseStream).toBe(ms);

        const reader3 = new BinaryReader(ms, new UTF8Encoding(), true);
        expect(reader3.bigEndian).toBe(true);
    });

    it("应该能读取基本类型", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeBoolean(true);
        writer.writeByte(123);
        writer.writeInt16(-1234);
        writer.writeInt32(12345678);
        writer.writeDouble(123.456);
        writer.writeString("Hello World");
        writer.writeSingle(1.5);
        writer.writeSByte(-10);
        writer.writeUInt16(60000);
        writer.writeUInt32(3000000000);
        writer.writeUInt64(BigInt("9000000000000000000"));
        writer.writeInt64(BigInt("-9000000000000000000"));
        
        ms.position = 0;
        const reader = new BinaryReader(ms);
        
        expect(reader.readBoolean()).toBe(true);
        expect(reader.readByte()).toBe(123);
        expect(reader.readInt16()).toBe(-1234);
        expect(reader.readInt32()).toBe(12345678);
        expect(reader.readDouble()).toBe(123.456);
        expect(reader.readString()).toBe("Hello World");
        expect(reader.readSingle()).toBe(1.5);
        expect(reader.readSByte()).toBe(-10);
        expect(reader.readUInt16()).toBe(60000);
        expect(reader.readUInt32()).toBe(3000000000);
        expect(reader.readUInt64()).toBe(BigInt("9000000000000000000"));
        expect(reader.readInt64()).toBe(BigInt("-9000000000000000000"));
    });

    it("应该能处理大端序", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.bigEndian = true;
        writer.writeInt16(0x1234); // 0x12 0x34
        
        ms.position = 0;
        const reader = new BinaryReader(ms);
        reader.bigEndian = true;
        
        expect(reader.readInt16()).toBe(0x1234);
        
        ms.position = 0;
        reader.bigEndian = false;
        // Little endian reads 0x34 0x12 -> 0x1234 swapped -> 0x3412 = 13330
        expect(reader.readInt16()).toBe(0x3412); 
    });

    it("readBytes 应该读取指定数量的字节", () => {
        const ms = new MemoryStream();
        ms.write(new Uint8Array([1, 2, 3, 4, 5]), 0, 5);
        ms.position = 0;
        
        const reader = new BinaryReader(ms);
        const bytes = reader.readBytes(3);
        
        expect(bytes.length).toBe(3);
        expect(bytes[0]).toBe(1);
        expect(bytes[2]).toBe(3);
    });

    it("peekChar 应该不移动位置", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.writeChar("A");
        ms.position = 0;
        
        const reader = new BinaryReader(ms);
        expect(reader.peekChar()).toBe("A".charCodeAt(0));
        expect(ms.position).toBe(0);
        expect(reader.readChar()).toBe("A");
        expect(ms.position).toBeGreaterThan(0);
    });
    
    it("read7BitEncodedInt 应该正确读取", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.write7BitEncodedInt(128); // 1000 0000 -> 0x80 0x01
        
        ms.position = 0;
        const reader = new BinaryReader(ms);
        expect(reader.read7BitEncodedInt()).toBe(128);
    });

    it("read (overloads) 应该正常工作", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.writeChar("A");
        writer.writeChar("B");
        writer.writeChar("C");
        ms.position = 0;

        const reader = new BinaryReader(ms);
        
        // read() -> char code
        expect(reader.read()).toBe("A".charCodeAt(0));

        // read(buffer, index, count) -> bytes
        const buffer = new Uint8Array(1);
        // "B" in UTF-8 is 66 (0x42)
        reader.read(buffer, 0, 1);
        expect(buffer[0]).toBe("B".charCodeAt(0));

        // read(charBuffer, index, count) -> chars
        const charBuffer = new Array<string>(1);
        reader.read(charBuffer, 0, 1);
        expect(charBuffer[0]).toBe("C");
    });

    it("readChars 应该读取字符数组", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.writeString("Hello"); // Length prefixed
        // We want raw chars for readChars
        ms.position = 0;
        ms.setLength(0);
        writer.writeChar("H");
        writer.writeChar("i");

        ms.position = 0;
        const reader = new BinaryReader(ms);
        const chars = reader.readChars(2);
        expect(chars.length).toBe(2);
        expect(chars[0]).toBe("H");
        expect(chars[1]).toBe("i");
    });

    it("pointer 应该临时跳转读取", async () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.writeByte(1);
        writer.writeByte(2);
        writer.writeByte(3);
        
        ms.position = 0;
        const reader = new BinaryReader(ms);
        
        const val = await reader.pointer(2, () => {
            return reader.readByte();
        });
        
        expect(val).toBe(3);
        expect(ms.position).toBe(0); // Should return to original position
    });

    it("close 应该关闭流", () => {
        const ms = new MemoryStream();
        const reader = new BinaryReader(ms);
        reader.close();
        expect(() => ms.canRead).toThrow();
    });
});
