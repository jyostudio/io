# @jyostudio/io

文件流操作。

## 引用

浏览器

```HTML
<script type="importmap">
  {
    "imports": {
      "@jyostudio/io": "https://unpkg.com/@jyostudio/io"
    }
  }
</script>
```

Node.js

```bash
npm install @jyostudio/io
```

根据环境引用后，用法完全一致，不需要在使用时区分引用地址和方式。

### 单独引用功能模块

如果你只需要使用其中的某个模块，可以直接引用 `dist` 目录下的对应文件，以减小体积。

**Node.js / 构建工具:**

```javascript
import BinaryReader from "@jyostudio/io/dist/binary-reader.js";
import Path from "@jyostudio/io/dist/path.js";
```

**浏览器 (CDN):**

```javascript
import BinaryReader from "https://unpkg.com/@jyostudio/io/dist/binary-reader.js";
```

## 用法

### MemoryStream

内存流，用于在内存中读写数据。

```typescript
import { MemoryStream, SeekOrigin } from "@jyostudio/io";

// 创建一个内存流
const stream = new MemoryStream();

// 写入数据
const data = new Uint8Array([1, 2, 3, 4, 5]);
stream.write(data, 0, data.length);

// 移动位置到开头
stream.seek(0, SeekOrigin.begin);

// 读取数据
const buffer = new Uint8Array(5);
const bytesRead = stream.read(buffer, 0, 5);

console.log(buffer); // Uint8Array(5) [ 1, 2, 3, 4, 5 ]

// 获取内部缓冲区
const internalBuffer = stream.toArray();
```

### BinaryWriter

用于将基本数据类型以二进制形式写入流。

```typescript
import { MemoryStream, BinaryWriter } from "@jyostudio/io";

const stream = new MemoryStream();
const writer = new BinaryWriter(stream);

// 写入各种类型的数据
writer.writeBoolean(true);
writer.writeInt32(12345);
writer.writeString("Hello World");
writer.writeDouble(3.14159);

// 获取流中的数据
const data = stream.toArray();
```

### BinaryReader

用于从流中读取二进制数据为基本数据类型。

```typescript
import { MemoryStream, BinaryWriter, BinaryReader, SeekOrigin } from "@jyostudio/io";

const stream = new MemoryStream();
const writer = new BinaryWriter(stream);
writer.writeInt32(42);
writer.writeString("Test");

// 重置流位置
stream.seek(0, SeekOrigin.begin);

const reader = new BinaryReader(stream);

// 按顺序读取数据
const num = reader.readInt32();
const str = reader.readString();

console.log(num); // 42
console.log(str); // "Test"
```

### Path

提供对包含文件或目录路径信息的 String 实例执行操作的方法。这些操作是以跨平台的方式执行的。

```typescript
import { Path } from "@jyostudio/io";

// 合并路径
const fullPath = Path.combine("folder", "subfolder", "file.txt");
// 输出: folder\subfolder\file.txt (Windows) 或 folder/subfolder/file.txt (Linux/macOS)

// 获取文件名
const fileName = Path.getFileName("/path/to/file.txt"); // file.txt

// 获取扩展名
const ext = Path.getExtension("file.txt"); // .txt

// 获取不带扩展名的文件名
const name = Path.getFileNameWithoutExtension("file.txt"); // file

// 获取目录名
const dir = Path.getDirectoryName("/path/to/file.txt"); // /path/to

// 更改扩展名
const newPath = Path.changeExtension("file.txt", ".md"); // file.md
```

### StringWriter

用于将信息写入字符串。底层使用 `StringBuilder`。

```typescript
import { StringWriter } from "@jyostudio/io";

const writer = new StringWriter();
writer.write("Hello");
writer.write(" ");
writer.write("World");
writer.write(123);

console.log(writer.toString()); // "Hello World123"
```

### StringReader

用于从字符串中读取字符。

```typescript
import { StringReader } from "@jyostudio/io";

const reader = new StringReader("Line1\nLine2");

const line1 = reader.readLine(); // "Line1"
const line2 = reader.readLine(); // "Line2"
const line3 = reader.readLine(); // null
```

## 许可证

MIT License

Copyright (c) 2025 nivk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.