import TypeUtils from "../../../libs/typeUtils";


export class AddCourtParameter {
    public name: string;
    public price: string;
    public type: string;

    constructor (init: Partial<AddCourtParameter>) {
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.price)) this.price = init.price;
        if (TypeUtils.isNotNone(init.type)) this.type = init.type;
    }
}