import overload from "@jyostudio/overload";

export default class FileHelper {
    static #getRequestPath(path) {
        if (path.indexOf("://") >= 0) {
            return path;
        }

        return FileHelper.resolveAbsolutePath(location.href, path);
    }

    static resolveAbsolutePath(...params) {
        FileHelper.resolveAbsolutePath = overload([String, String], function (path, relative) {
            if (relative[0] === "/") return relative;

            let newPath = path;
            newPath = newPath.split("/");
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

        return FileHelper.resolveAbsolutePath.apply(this, params);
    }

    static async(...params) {
        FileHelper.async = overload([String], async function (path) {
            return new Uint8Array(await (await fetch(FileHelper.#getRequestPath(path))).arrayBuffer());
        });

        return FileHelper.async.apply(this, params);
    }

    static sync(...params) {
        FileHelper.sync = overload([String], function (path) {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.open("GET", FileHelper.#getRequestPath(path), false);
            xhr.send();
            if (xhr.status == 0 || xhr.status == 200) {
                let byte = [];
                for (let i = 0, len = xhr.response.length; i < len; ++i) {
                    let c = xhr.response.charCodeAt(i);
                    byte[byte.length] = c & 0xff;
                }

                return Uint8Array.from(byte);
            }
            throw new Error("Failed to load file: " + path);
        });

        return FileHelper.sync.apply(this, params);
    }
}