import { describe, it, expect } from "../runner";
import { MemoryStream, SeekOrigin } from "../../src/index";

describe("MemoryStream 类测试", () => {
    it("构造函数应该正确初始化", () => {
        // Default
        const ms1 = new MemoryStream();
        expect(ms1.canRead).toBe(true);
        expect(ms1.canWrite).toBe(true);
        expect(ms1.length).toBe(0);

        // Capacity
        const ms2 = new MemoryStream(100);
        expect(ms2.capacity).toBe(100);
        expect(ms2.length).toBe(0);

        // Buffer
        const buffer = new Uint8Array([1, 2, 3]);
        const ms3 = new MemoryStream(buffer);
        expect(ms3.length).toBe(3);
        expect(ms3.canWrite).toBe(true);

        // Buffer, writable
        const ms4 = new MemoryStream(buffer, false);
        expect(ms4.canWrite).toBe(false);

        // Buffer, index, count
        const ms5 = new MemoryStream(buffer, 1, 2);
        expect(ms5.length).toBe(2);
        expect(ms5.readByte()).toBe(2);

        // Buffer, index, count, writable, publiclyVisible
        const ms6 = new MemoryStream(buffer, 0, 3, true, true);
        expect(ms6.getBuffer()).toBe(buffer);
    });

    it("写入和读取应该正常工作", () => {
        const ms = new MemoryStream();
        const buffer = new Uint8Array([1, 2, 3, 4, 5]);
        ms.write(buffer, 0, 5);

        expect(ms.length).toBe(5);
        expect(ms.position).toBe(5);

        ms.position = 0;
        const readBuffer = new Uint8Array(5);
        const readCount = ms.read(readBuffer, 0, 5);

        expect(readCount).toBe(5);
        expect(readBuffer[0]).toBe(1);
        expect(readBuffer[4]).toBe(5);
    });

    it("Seek 应该正确移动位置", () => {
        const ms = new MemoryStream();
        ms.write(new Uint8Array([1, 2, 3, 4, 5]), 0, 5);

        ms.seek(2, SeekOrigin.begin);
        expect(ms.position).toBe(2);
        expect(ms.readByte()).toBe(3);

        ms.seek(-1, SeekOrigin.current);
        expect(ms.position).toBe(2);

        ms.seek(-2, SeekOrigin.end);
        expect(ms.position).toBe(3);
        expect(ms.readByte()).toBe(4);
    });

    it("SetLength 应该改变流长度", () => {
        const ms = new MemoryStream();
        ms.setLength(10);
        expect(ms.length).toBe(10);
        
        ms.position = 10;
        ms.setLength(5);
        expect(ms.length).toBe(5);
        expect(ms.position).toBe(5); // Position should be truncated
    });

    it("ToArray 应该返回正确的数据", () => {
        const ms = new MemoryStream();
        ms.write(new Uint8Array([1, 2, 3]), 0, 3);
        const arr = ms.toArray();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe(1);
        expect(arr[2]).toBe(3);
    });

    it("WriteByte 和 ReadByte 应该正常工作", () => {
        const ms = new MemoryStream();
        ms.writeByte(100);
        ms.position = 0;
        expect(ms.readByte()).toBe(100);
        expect(ms.readByte()).toBe(-1); // End of stream
    });
    
    it("Capacity 应该自动扩展", () => {
        const ms = new MemoryStream(2);
        expect(ms.capacity).toBe(2);
        ms.write(new Uint8Array([1, 2, 3]), 0, 3);
        expect(ms.length).toBe(3);
        expect(ms.capacity).toBeGreaterThan(2);
    });

    it("writeTo 应该写入到另一个流", () => {
        const ms1 = new MemoryStream();
        ms1.write(new Uint8Array([1, 2, 3]), 0, 3);
        
        const ms2 = new MemoryStream();
        ms1.writeTo(ms2);
        
        expect(ms2.length).toBe(3);
        ms2.position = 0;
        expect(ms2.readByte()).toBe(1);
    });

    it("close 应该释放资源", () => {
        const ms = new MemoryStream();
        ms.close();
        
        // 资源释放后，访问属性或方法应该抛出异常
        expect(() => ms.canRead).toThrow();
        expect(() => ms.canWrite).toThrow();
        expect(() => ms.readByte()).toThrow();
    });
});
