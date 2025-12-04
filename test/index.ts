import { runTests } from "./runner";
import "./tests/path.test";
import "./tests/memory-stream.test";
import "./tests/binary-reader.test";
import "./tests/binary-writer.test";
import "./tests/string-reader.test";
import "./tests/string-writer.test";
import "./tests/stream.test";

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}
