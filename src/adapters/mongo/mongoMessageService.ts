import { ObjectID } from "mongodb";
import { Service } from "typedi";
import AggregateBuilder, { AggregateJoinRule } from "../../aggregateBuilder";
import { MongoDatabase } from "../../database/mongoDatabase";
import { Court } from "../../entities/court";
import { Message } from "../../entities/message";
import { User } from "../../entities/user";
import TypeUtils from "../../libs/typeUtils";
import { MessageGateway } from "../data_access/messageGateway";
import { AddMessageParameter } from "../data_access/parameters/addMessageParameter";

@Service()
@Service('MessageService')
export class MongoMessageService implements MessageGateway {
    private database: MongoDatabase;
    private collectionName = 'messages';

    private userJoinRule = new AggregateJoinRule()
                                    .setFrom('users')
                                    .setLocalField('userId')
                                    .setForeignField('_id')
                                    .setAsField('user');


    constructor (database: MongoDatabase) {
        this.database = database;
    }

    async addMessage(parameter: AddMessageParameter): Promise<Message> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.insertOne({ 
            courtId: new ObjectID(parameter.courtId),
            userId: new ObjectID(parameter.userId),
            content: parameter.content,
            createdTime: new Date()
        });
        const aggregate = new AggregateBuilder()
                                .match({ _id: result.ops[0]._id })
                                .joinOptional(this.userJoinRule)
                                .build();
        const results = await collection.aggregate(aggregate).toArray();
        return this.toMessage(results[0]);
    }

    private toMessage (json: any): Message {
        return new Message({
            id: json._id,
            user: new User({
                id: json.user._id,
                name: json.user.name,
            }),
            courtId: json.courtId,
            content: json.content,
            createdTime: json.createdTime
        });
    }
}
