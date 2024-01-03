export class Container {
    constructor(id, containerId, port, endTime) {
        this.id = id;
        this.containerId = containerId;
        this.port = port;
        this.endTime = endTime;
        this.forward = [];
    }
}