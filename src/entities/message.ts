import TypeUtils from "../libs/typeUtils";
import { Court } from "./court";
import { User } from "./user";

export class Message {
    public id: string;
    public user: User;
    public courtId: string;
    public content: string;
    public createdTime: Date;

    constructor (init: Partial<Message>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.user)) this.user = init.user;
        if (TypeUtils.isNotNone(init.courtId)) this.courtId = init.courtId;
        if (TypeUtils.isNotNone(init.content)) this.content = init.content;
        if (TypeUtils.isNotNone(init.createdTime)) this.createdTime = init.createdTime;
    }
}
