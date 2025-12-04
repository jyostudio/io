import Enum from "@jyostudio/enum";
/**
 * 指定要用于查找的流中的位置。
 * @enum
 */
export default class SeekOrigin extends Enum {
    #private;
    /**
     * 指定流的开始位置。
     */
    static get begin(): SeekOrigin;
    /**
     * 指定流中的当前位置。
     */
    static get current(): SeekOrigin;
    /**
     * 指定流的末尾。
     */
    static get end(): SeekOrigin;
}
//# sourceMappingURL=seek-origin.d.ts.map