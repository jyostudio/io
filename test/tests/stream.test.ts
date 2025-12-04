import { describe, it, expect } from "../runner";
import { Stream, MemoryStream } from "../../src/index";

describe("Stream 类测试", () => {
    it("Stream.null 应该返回空流", () => {
        const nullStream = Stream.null;
        expect(nullStream.canRead).toBe(true);
        expect(nullStream.canWrite).toBe(true);
        expect(nullStream.canSeek).toBe(true);
        expect(nullStream.length).toBe(0);
        expect(nullStream.position).toBe(0);
        
        // Read returns 0
        const buffer = new Uint8Array(10);
        expect(nullStream.read(buffer, 0, 10)).toBe(0);
        
        // Write does nothing
        nullStream.write(buffer, 0, 10);
    });

    it("copyTo 应该复制数据", () => {
        const src = new MemoryStream();
        src.write(new Uint8Array([1, 2, 3]), 0, 3);
        src.position = 0;

        const dst = new MemoryStream();
        src.copyTo(dst);

        expect(dst.length).toBe(3);
        dst.position = 0;
        expect(dst.readByte()).toBe(1);
    });

    it("readAsync 应该异步读取", async () => {
        const ms = new MemoryStream();
        ms.write(new Uint8Array([1, 2, 3]), 0, 3);
        ms.position = 0;

        const buffer = new Uint8Array(3);
        const result = await ms.readAsync(buffer, 0, 3);
        
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
    });

    it("writeAsync 应该异步写入", async () => {
        const ms = new MemoryStream();
        const buffer = new Uint8Array([1, 2, 3]);
        
        const count = await ms.writeAsync(buffer, 0, 3);
        expect(count).toBe(3);
        expect(ms.length).toBe(3);
    });
});
