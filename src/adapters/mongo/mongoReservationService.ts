import { ObjectID } from "mongodb";
import { Service } from "typedi";
import AggregateBuilder, { AggregateJoinRule } from "./aggregateBuilder";
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

    async findAllReservation(): Promise<Reservation[]> {
        const collection = await this.database.getCollection(this.collectionName);
        const aggregate = new AggregateBuilder()
                                .joinOptional(this.userJoinRule)
                                .joinOptional(this.courtJoinRule)
                                .sort({ createdTime: -1 })
                                .build();
        const results = await collection.aggregate(aggregate).toArray();
        return results.map(result => this.toReservation(result));
    }
    
    async findById (id: string): Promise<Reservation> {
        const collection = await this.database.getCollection(this.collectionName);
        const aggregate = new AggregateBuilder()
                                .match({ _id: new ObjectID(id) })
                                .joinOptional(this.userJoinRule)
                                .joinOptional(this.courtJoinRule)
                                .sort({ createdTime: -1 })
                                .build();
        const results = await collection.aggregate(aggregate).toArray();
        return (results.length === 0) ? null : this.toReservation(results[0]);
    }

    async find (parameter: SearchReservationParameter): Promise<Reservation[]> {
        const filter: any = {};
        if (TypeUtils.isNotNone(parameter.id)) filter._id = new ObjectID(parameter.id);
        if (TypeUtils.isNotNone(parameter.courtId)) filter.courtId = new ObjectID(parameter.courtId);
        if (TypeUtils.isNotNone(parameter.userId)) filter.userId = new ObjectID(parameter.userId);
        if (TypeUtils.isNotNone(parameter.date)) filter.date = parameter.date;
        if (TypeUtils.isNotNone(parameter.time)) filter.time = parameter.time;
        if (TypeUtils.isNotNone(parameter.keyword)) {
            filter.$or = [
                { 'court.name': { $regex: `.*${parameter.keyword}.*`, $options: 'i' } },
                { 'user.name': { $regex: `.*${parameter.keyword}.*`, $options: 'i' } },
            ]
        }
        const collection = await this.database.getCollection(this.collectionName);
        const aggregate = new AggregateBuilder()
                                .joinOptional(this.userJoinRule)
                                .joinOptional(this.courtJoinRule)
                                .match(filter)
                                .sort({ createdTime: -1 })
                                .build();
        const results = await collection.aggregate(aggregate).toArray();
        return results.map(result => this.toReservation(result));
        // const keywordFilter: any = {};
        // if (TypeUtils.isNotNone(parameter.keyword)) {
        //     keywordFilter.$or = [
        //         { 'court.name': {name: { $regex: `.*${parameter.keyword}.*`, $options: 'i' }} },
        //         { 'user.name': {name: { $regex: `.*${parameter.keyword}.*`, $options: 'i' }} },
        //     ]
        //     console.log(123);
        //     const keywordResults = await collection.aggregate(aggregate).match(keywordFilter).toArray();
        //     return keywordResults.map(result => this.toReservation(result));
        // } else {
        //     const results = await collection.aggregate(aggregate).toArray();
        //     return results.map(result => this.toReservation(result));
        // }
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

    async deleteReservation (id: string): Promise<void> {
        const collection = await this.database.getCollection(this.collectionName);
        await collection.deleteOne({ _id: new ObjectID(id) });
    }

    private toReservation (json: any): Reservation {
        return new Reservation({
            id: json._id.toString(),
            court: new Court({
                id: json.court._id.toString(),
                name: json.court.name,
                price: json.court.price,
            }),
            user: new User({
                id: json.user._id.toString(),
                name: json.user.name,
                studentId: json.user.studentId,
                email: json.user.email,
                phone: json.user.phone
            }),
            date: json.date,
            time: json.time,
            createdTime: json.createdTime
        });
    }
}