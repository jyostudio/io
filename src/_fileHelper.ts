import overload from "@jyostudio/overload";

export default class _FileHelper {
    /**
     * 获取请求路径
     * @param path 接口路径
     * @returns 请求路径
     */
    static #getRequestPath(path: string): string {
        if (path.indexOf("://") >= 0) {
            return path;
        }

        return this.resolveAbsolutePath(globalThis?.location?.href ?? "", path);
    }

    /**
     * 解析绝对路径
     * @param path 基准路径
     * @param relative 相对路径
     */
    static resolveAbsolutePath(path: string, relative: string): string;

    static resolveAbsolutePath(...params: any): any {
        _FileHelper.resolveAbsolutePath = overload([String, String], function (path: string, relative: string) {
            if (relative[0] === "/") return relative;

            let newPath = path.split("/");
            newPath.pop();

            let relativeArr = relative.split("/");

            for (let i = 0; i < relativeArr.length; i++) {
                switch (relativeArr[i]) {
                    case "..":
                        newPath.pop();
                        relativeArr.shift();
                        i--;
                        break;
                    case ".":
                        relativeArr.shift();
                        i--;
                        break;
                }
            }

            return newPath.concat(relativeArr).join("/");
        });

        return _FileHelper.resolveAbsolutePath.apply(this, params);
    }

    /**
     * 异步加载文件
     * @param path 文件路径
     * @returns 文件内容
     */
    static async(path: string): Promise<Uint8Array>;

    static async(...params: any): any {
        _FileHelper.async = overload([String], async function (path: string): Promise<Uint8Array> {
            return new Uint8Array(await (await fetch(_FileHelper.#getRequestPath(path))).arrayBuffer());
        });

        return _FileHelper.async.apply(this, params);
    }

    /**
     * 同步加载文件
     * @param path 文件路径
     * @returns 文件内容
     */
    static sync(path: string): Uint8Array;

    static sync(...params: any): any {
        _FileHelper.sync = overload([String], function (path: string): Uint8Array {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.open("GET", _FileHelper.#getRequestPath(path), false);
            xhr.send();
            if (xhr.status == 0 || xhr.status == 200) {
                let byte = [];
                for (let i = 0, len = xhr.response.length; i < len; ++i) {
                    let c = xhr.response.charCodeAt(i);
                    byte[byte.length] = c & 0xFF;
                }

                return Uint8Array.from(byte);
            }
            throw new Error(`加载文件失败：${path}，状态码：${xhr.status}`);
        });

        return _FileHelper.sync.apply(this, params);
    }
}