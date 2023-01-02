import TypeUtils from "../libs/typeUtils";

export class User {
    public id: string;
    public name: string;
    public studentId: string;
    public email: string;
    public phone: string;
    public role: string;
    public createdTime: Date;
    public lastModified: Date;

    constructor (init: Partial<User>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.name)) this.name = init.name;
        if (TypeUtils.isNotNone(init.studentId)) this.studentId = init.studentId;
        if (TypeUtils.isNotNone(init.email)) this.email = init.email;
        if (TypeUtils.isNotNone(init.phone)) this.phone = init.phone;
        if (TypeUtils.isNotNone(init.role)) this.role = init.role;
        if (TypeUtils.isNotNone(init.createdTime)) this.createdTime = init.createdTime;
        if (TypeUtils.isNotNone(init.lastModified)) this.lastModified = init.lastModified;
    }
}
