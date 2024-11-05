import List from "@jyostudio/list";
import BinaryReader from "../src/binaryReader.js";
import BinaryWriter from "../src/binaryWriter.js";
import MemoryStream from "../src/memoryStream.js";

const ms = new MemoryStream();
const bw = new BinaryWriter(ms);
let a = new List(String, "Hello, World!".split(""))
bw.writeChars(a);
ms.position = 0;
const br = new BinaryReader(ms);
console.dir(br.readChars(13).join(""));