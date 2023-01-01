import { Service } from "typedi";
import { MongoDatabase } from "../../database/mongoDatabase";
import { Reservation } from "../../entities/reservation";
import TypeUtils from "../../libs/typeUtils";
import { AddReservationParameter } from "../data_access/parameters/addReservationParameter";
import { SearchReservationParameter } from "../data_access/parameters/searchReservationParameter";
import { ReservationGateway } from "../data_access/reservationGateway";

@Service()
@Service('ReservationService')
export class MongoReservationService implements ReservationGateway {
    private database: MongoDatabase;

    private collectionName = 'reservations';

    constructor (database: MongoDatabase) {
        this.database = database;
    }

    async find (parameter: SearchReservationParameter): Promise<Reservation> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.findOne({ 
            courtId: parameter.courtId,
            userId: parameter.userId,
            date: parameter.date,
            time: parameter.time

        });
        return TypeUtils.isNone(result) ? result : this.toReservation(result);
    }

    async addReservation(paramater: AddReservationParameter): Promise<Reservation> {
        const collection = await this.database.getCollection(this.collectionName);
        const result = await collection.insertOne({ 
            courtId: paramater.courtId,
            userId: paramater.userId,
            date: paramater.date,
            time: paramater.time
        });
        return this.toReservation(result.ops[0]);
    }

    private toReservation (json: any): Reservation {
        return new Reservation({
            courtId: json.courtId,
            userId: json.userId,
            date: json.date,
            time: json.time
        });
    }
}