import { ObjectID } from "mongodb";
import { Service } from "typedi";
import AggregateBuilder, { AggregateJoinRule } from "../../aggregateBuilder";
import { MongoDatabase } from "../../database/mongoDatabase";
import { Message } from "../../entities/message";
import { User } from "../../entities/user";
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

    async findMessages (courtId: string): Promise<Message[]> {
        const collection = await this.database.getCollection(this.collectionName);

        const aggregate = new AggregateBuilder()
                                .match({ courtId: new ObjectID(courtId) })
                                .joinOptional(this.userJoinRule)
                                .build();

        const results = await collection.aggregate(aggregate).toArray();
        return results.map(r => this.toMessage(r));
    }

    private toMessage (json: any): Message {
        return new Message({
            id: json._id,
            user: new User({
                id: json.user._id,
                name: json.user.name,
                studentId: json.user.studentId
            }),
            courtId: json.courtId,
            content: json.content,
            createdTime: json.createdTime
        });
    }
}
