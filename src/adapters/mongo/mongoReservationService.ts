import { ObjectID } from "mongodb";
import { Service } from "typedi";
import AggregateBuilder, { AggregateJoinRule } from "../../aggregateBuilder";
import { MongoDatabase } from "../../database/mongoDatabase";
import { Court } from "../../entities/court";
import { Reservation } from "../../entities/reservation";
import { User } from "../../entities/user";
import TypeUtils from "../../libs/typeUtils";
import { AddReservationParameter } from "../data_access/parameters/addReservationParameter";
import { SearchReservationParameter } from "../data_access/parameters/searchReservationParameter";
import { ReservationGateway } from "../data_access/reservationGateway";

@Service()
@Service('ReservationService')
export class MongoReservationService implements ReservationGateway {

    private database: MongoDatabase;
    private collectionName = 'reservations';

    private userJoinRule = new AggregateJoinRule()
                                    .setFrom('users')
                                    .setLocalField('userId')
                                    .setForeignField('_id')
                                    .setAsField('user');

    private courtJoinRule = new AggregateJoinRule()
                                    .setFrom('courts')
                                    .setLocalField('courtId')
                                    .setForeignField('_id')
                                    .setAsField('court');

    constructor (database: MongoDatabase) {
        this.database = database;
    }

    async find (parameter: SearchReservationParameter): Promise<Reservation[]> {
        const filter: any = {};
        if (TypeUtils.isNotNone(parameter.id)) filter._id = new ObjectID(parameter.id);
        if (TypeUtils.isNotNone(parameter.courtId)) filter.courtId = new ObjectID(parameter.courtId);
        if (TypeUtils.isNotNone(parameter.userId)) filter.userId = new ObjectID(parameter.userId);
        if (TypeUtils.isNotNone(parameter.date)) filter.date = parameter.date;
        if (TypeUtils.isNotNone(parameter.time)) filter.time = parameter.time;

        const collection = await this.database.getCollection(this.collectionName);
        const aggregate = new AggregateBuilder()
                                .match(filter)
                                .joinOptional(this.userJoinRule)
                                .joinOptional(this.courtJoinRule)
                                .build();
        const results = await collection.aggregate(aggregate).toArray();
        return results.map(result => this.toReservation(result));
    }

    async addReservation(paramater: AddReservationParameter): Promise<Reservation> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.insertOne({ 
            courtId: new ObjectID(paramater.courtId),
            userId: new ObjectID(paramater.userId),
            date: paramater.date,
            time: paramater.time,
            createdTime: new Date()
        });
        
        return (await this.find(new SearchReservationParameter({ id: result.ops[0]._id })))[0];
    }

    private toReservation (json: any): Reservation {
        return new Reservation({
            id: json._id,
            court: new Court({
                id: json.court._id,
                name: json.court.name,
                price: json.court.price,
            }),
            user: new User({
                id: json.user._id,
                name: json.user.name,
            }),
            date: json.date,
            time: json.time,
            createdTime: json.createdTime
        });
    }
}