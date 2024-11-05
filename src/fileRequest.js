import overload from "@jyostudio/overload";

export default class FileRequest {
    static #getRequestPath(path) {
        if (path.indexOf("://") >= 0) {
            return path;
        }

        return FileRequest.resolveRelativePath(location.href, path);
    }

    static resolveRelativePath(...params) {
        FileRequest.resolveRelativePath = overload([String, String], function (path, relative) {
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

        return FileRequest.resolveRelativePath.apply(this, params);
    }

    static async(...params) {
        FileRequest.async = overload([String], async function (path) {
            return new Uint8Array(await (await fetch(FileRequest.#getRequestPath(path))).arrayBuffer());
        });

        return FileRequest.async.apply(this, params);
    }

    static sync(...params) {
        FileRequest.sync = overload([String], function (path) {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.open("GET", FileRequest.#getRequestPath(path), false);
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

        return FileRequest.sync.apply(this, params);
    }
}