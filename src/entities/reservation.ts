import TypeUtils from "../libs/typeUtils";
import { Court } from "./court";
import { User } from "./user";

export class Reservation {
    public id: string;
    public date: string;
    public time: string;
    public user: User;
    public court: Court;
    public createdTime: Date;

    constructor (init: Partial<Reservation>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.date)) this.date = init.date;
        if (TypeUtils.isNotNone(init.time)) this.time = init.time;
        if (TypeUtils.isNotNone(init.user)) this.user = init.user;
        if (TypeUtils.isNotNone(init.court)) this.court = init.court;
        if (TypeUtils.isNotNone(init.createdTime)) this.createdTime = init.createdTime;
    }
}
