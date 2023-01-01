import TypeUtils from "../libs/typeUtils";

export class Reservation {
    public courtId: string;
    public userId: string;
    public date: string;
    public time: string;

    constructor (init: Partial<Reservation>) {
        if (TypeUtils.isNotNone(init.courtId)) this.courtId = init.courtId;
        if (TypeUtils.isNotNone(init.userId)) this.userId = init.userId;
        if (TypeUtils.isNotNone(init.date)) this.date = init.date;
        if (TypeUtils.isNotNone(init.time)) this.time = init.time;
    }
}
