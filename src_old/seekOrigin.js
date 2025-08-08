import Enum from "@jyostudio/enum";

export default class SeekOrigin extends Enum {
    static {
        this.set({
            begin: 0,
            current: 1,
            end: 2
        })
    }
}