import { describe, it, expect } from "../runner";
import { MemoryStream, BinaryWriter, SeekOrigin, BinaryReader } from "../../src/index";
import { UTF8Encoding } from "@jyostudio/text";
import List from "@jyostudio/list";

describe("BinaryWriter 类测试", () => {
    it("构造函数应该正确初始化", () => {
        const ms = new MemoryStream();
        const writer1 = new BinaryWriter(ms);
        expect(writer1.baseStream).toBe(ms);

        const writer2 = new BinaryWriter(ms, new UTF8Encoding());
        expect(writer2.baseStream).toBe(ms);

        const writer3 = new BinaryWriter(ms, new UTF8Encoding(), true);
        expect(writer3.bigEndian).toBe(true);
    });

    it("writeBoolean 应该写入 0 或 1", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeBoolean(false);
        writer.writeBoolean(true);
        
        const bytes = ms.toArray();
        expect(bytes[0]).toBe(0);
        expect(bytes[1]).toBe(1);
    });

    it("writeInt32 应该写入 4 字节", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeInt32(0x12345678);
        
        const bytes = ms.toArray();
        expect(bytes.length).toBe(4);
        // Little endian: 78 56 34 12
        expect(bytes[0]).toBe(0x78);
        expect(bytes[3]).toBe(0x12);
    });

    it("writeString 应该写入长度前缀和内容", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        const str = "ABC";
        writer.writeString(str);
        
        const bytes = ms.toArray();
        // Length 3 (7-bit encoded) + 'A' 'B' 'C'
        expect(bytes[0]).toBe(3);
        expect(bytes[1]).toBe("A".charCodeAt(0));
        expect(bytes[3]).toBe("C".charCodeAt(0));
    });

    it("seek 应该改变基础流位置", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeByte(1);
        writer.seek(0, SeekOrigin.begin);
        writer.writeByte(2);
        
        const bytes = ms.toArray();
        expect(bytes[0]).toBe(2);
    });

    it("writeBytes 应该写入字节数组", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        const buffer = new Uint8Array([1, 2, 3]);
        
        writer.writeBytes(buffer);
        expect(ms.length).toBe(3);
        
        writer.writeBytes(buffer, 1, 1);
        expect(ms.length).toBe(4);
        expect(ms.toArray()[3]).toBe(2);
    });

    it("writeChar 和 writeChars 应该写入字符", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeChar("A");
        
        const list = new List(String);
        list.add("B");
        list.add("C");
        writer.writeChars(list);
        
        writer.writeChars(list, 1, 1); // Write 'C' again
        
        const bytes = ms.toArray();
        // UTF-8 for A, B, C, C
        expect(bytes.length).toBe(4);
        expect(bytes[0]).toBe("A".charCodeAt(0));
        expect(bytes[3]).toBe("C".charCodeAt(0));
    });

    it("writeDouble 和 writeSingle 应该写入浮点数", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeDouble(1.23);
        writer.writeSingle(4.56);
        
        expect(ms.length).toBe(8 + 4);
    });

    it("writeInt16, writeInt64, writeSByte 应该正常工作", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeInt16(-1);
        writer.writeInt64(BigInt(100));
        writer.writeSByte(-10);
        
        expect(ms.length).toBe(2 + 8 + 1);
    });

    it("writeUInt16, writeUInt32, writeUInt64 应该正常工作", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        
        writer.writeUInt16(60000);
        writer.writeUInt32(3000000000);
        writer.writeUInt64(BigInt("9000000000000000000"));
        
        expect(ms.length).toBe(2 + 4 + 8);
    });

    it("flush 应该调用流的 flush", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        // MemoryStream flush does nothing, but we check if it throws
        writer.flush();
    });

    it("close 应该关闭流", () => {
        const ms = new MemoryStream();
        const writer = new BinaryWriter(ms);
        writer.close();
        expect(() => ms.canWrite).toThrow();
    });
});
