import TypeUtils from "../libs/typeUtils";

export class Court {
    public _id: string;
    public name: string;
    public price: string;
    public type: string;
    public beReserved: boolean;
    public createdTime: Date;
    public lastModified: Date;

    constructor (init: Partial<Court>) {
        if (TypeUtils.isNotNone(init._id)) this._id = init._id;
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.price)) this.price = init.price;
        if (TypeUtils.isNotNone(init.type)) this.type = init.type;
        if (TypeUtils.isNotNone(init.beReserved)) this.beReserved = init.beReserved;
        if (TypeUtils.isNotNone(init.createdTime)) this.createdTime = init.createdTime;
        if (TypeUtils.isNotNone(init.lastModified)) this.lastModified = init.lastModified;
    }
}
