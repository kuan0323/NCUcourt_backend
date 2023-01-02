import { Message } from "../../entities/message";
import { AddMessageParameter } from "./parameters/addMessageParameter";

export interface MessageGateway {
    addMessage (parameter: AddMessageParameter): Promise<Message>
    findById (id: string): Promise<Message>;
    findMessages (courtId: string): Promise<Message[]>
    deleteMessage (id: string): Promise<void>;
}