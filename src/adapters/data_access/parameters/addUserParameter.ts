import TypeUtils from "../../../libs/typeUtils";


export class AddUserParameter {
    public name: string;
    public studentId: string;
    public email: string;
    public password: string;
    public phone: string;
    public role: string;

    constructor (init: Partial<AddUserParameter>) {
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.studentId)) this.studentId = init.studentId;
        if (TypeUtils.isNotNone(init.email)) this.email = init.email;
        if (TypeUtils.isNotNone(init.password)) this.password = init.password;
        if (TypeUtils.isNotNone(init.phone)) this.phone = init.phone;
        if (TypeUtils.isNotNone(init.role)) this.role = init.role;
    }
}
