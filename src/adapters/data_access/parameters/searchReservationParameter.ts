import TypeUtils from "../../../libs/typeUtils";

export class SearchReservationParameter {
    public id: string;
    public courtId: string;
    public userId: string;
    public date: string;
    public time: string;
    public keyword: string;

    constructor (init: Partial<SearchReservationParameter>) {
        if (TypeUtils.isNotNone(init.id)) this.id = init.id;
        if (TypeUtils.isNotNone(init.courtId)) this.courtId = init.courtId;
        if (TypeUtils.isNotNone(init.userId)) this.userId = init.userId;
        if (TypeUtils.isNotNone(init.date)) this.date = init.date;
        if (TypeUtils.isNotNone(init.time)) this.time = init.time;
        if (TypeUtils.isNotNone(init.keyword)) this.keyword = init.keyword;
    }
}



