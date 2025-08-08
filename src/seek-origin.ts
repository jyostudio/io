import Enum from "@jyostudio/enum";

/**
 * 指定要用于查找的流中的位置。
 * @enum
 */
export default class SeekOrigin extends Enum {
    static #begin = new SeekOrigin(0);

    static #current = new SeekOrigin(1);

    static #end = new SeekOrigin(2);

    /**
     * 指定流的开始位置。
     */
    static get begin(): SeekOrigin { return SeekOrigin.#begin; }

    /**
     * 指定流中的当前位置。
     */
    static get current(): SeekOrigin { return SeekOrigin.#current; }

    /**
     * 指定流的末尾。
     */
    static get end(): SeekOrigin { return SeekOrigin.#end; }

    static {
        // 冻结类，防止被修改
        Object.freeze(SeekOrigin);
    }
}