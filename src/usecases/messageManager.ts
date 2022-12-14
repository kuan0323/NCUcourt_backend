import { Inject, Service } from "typedi";
import { MessageGateway } from "../adapters/data_access/messageGateway";
import { AddMessageParameter } from "../adapters/data_access/parameters/addMessageParameter";
import { UserGateway } from "../adapters/data_access/userGateway";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";
import { PermissionError } from "../exceptions/permissionError";
import TypeUtils from "../libs/typeUtils";

@Service()
export class MessageManager {
    @Inject('MessageService')
    private messageGateway: MessageGateway;
    @Inject('UserService')
    private userGateway: UserGateway;

    constructor (messageGateway: MessageGateway, userGateway: UserGateway) {
        this.messageGateway = messageGateway;
        this.userGateway = userGateway;
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

    async deleteMessage (userId: string, id: string) {
        const user = await this.userGateway.findById(userId);
        const message = await this.messageGateway.findById(id);
        if (TypeUtils.isNone(message)) {
            throw new IllegalArgumentError('the message is not exist.');
        }
        if (userId === message.user.id || user.role === 'admin' || user.role === 'superAdmin') {
            await this.messageGateway.deleteMessage(id);
        } else {
            throw new PermissionError('no permission to delete the message.');
        }
    }
}