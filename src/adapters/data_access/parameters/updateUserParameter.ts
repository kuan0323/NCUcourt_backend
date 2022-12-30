import TypeUtils from "../../../libs/typeUtils";


export class UpdateUserParameter {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public phone: string;

    constructor (init: Partial<UpdateUserParameter>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.email)) this.email = init.email;
        if (TypeUtils.isNotNone(init.password)) this.password = init.password;
        if (TypeUtils.isNotNone(init.phone)) this.phone = init.phone;
    }
}
