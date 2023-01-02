import TypeUtils from "../../../libs/typeUtils";


export class UpdateCourtParameter {
    public id: string;
    public name: string;
    public price: string;
    public type: string;
    public photo: string;

    constructor (init: Partial<UpdateCourtParameter>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.price)) this.price = init.price;
        if (TypeUtils.isNotNone(init.type)) this.type = init.type;
        if (TypeUtils.isNotNone(init.photo)) this.photo = init.photo;
    }
}