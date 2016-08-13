/**
 * Created by cavasblack on 16/8/13.
 */
export default class R707 {
    constructor() {
        
    }

    listen(port = 6666, host = "localhost") {
        this.host = host;
        this.port = port;
    }
}