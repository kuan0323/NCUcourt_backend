import TypeUtils from "../../../libs/typeUtils";


export class AddMessageParameter {
    public courtId: string;
    public userId: string;
    public content: string;

    constructor (init: Partial<AddMessageParameter>) {
        if (TypeUtils.isNotNone(init.courtId)) this.courtId = init.courtId;
        if (TypeUtils.isNotNone(init.userId)) this.userId = init.userId;
        if (TypeUtils.isNotNone(init.content)) this.content = init.content;
    }
}