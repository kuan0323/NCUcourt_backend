import { Inject, Service } from "typedi";
import { MessageGateway } from "../adapters/data_access/messageGateway";
import { AddMessageParameter } from "../adapters/data_access/parameters/addMessageParameter";

@Service()
export class MessageManager {
    @Inject('MessageService')
    private messageGateway: MessageGateway;

    constructor (messageGateway: MessageGateway) {
        this.messageGateway = messageGateway;
    }

    async addMessage({userId, courtId, content}: {
        userId: string, courtId: string, content: string
    }) {
        const message = await this.messageGateway.addMessage(new AddMessageParameter({
            userId, courtId, content
        }));
        return message;
    }

    async viewMessage(courtId: string) {
        return await this.messageGateway.findMessages(courtId);
    }
}