import TypeUtils from "../libs/typeUtils";

export class User {
    public _id: string;
    public name: string;
    public studentId: string;
    public email: string;
    public phone: string;
    public role: string;
    public createdTime: Date;

    constructor (init: Partial<User>) {
        if (TypeUtils.isNotNone(init._id)) this._id = init._id;
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.studentId)) this.studentId = init.studentId;
        if (TypeUtils.isNotNone(init.email)) this.email = init.email;
        if (TypeUtils.isNotNone(init.phone)) this.phone = init.phone;
        if (TypeUtils.isNotNone(init.role)) this.role = init.role;
        if (TypeUtils.isNotNone(init.createdTime)) this.createdTime = init.createdTime;
    }
}
