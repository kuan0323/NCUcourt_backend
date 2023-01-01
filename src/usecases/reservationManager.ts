import { Inject, Service } from "typedi";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError"
import TypeUtils from "../libs/typeUtils"
import { ReservationGateway } from "../adapters/data_access/reservationGateway";
import { AddReservationParameter } from "../adapters/data_access/parameters/addReservationParameter";


@Service()
export class ReservationManager {
    @Inject('ReservationService')
    private reservationGateway: ReservationGateway;

    constructor (reservationGateway: ReservationGateway) {
        this.reservationGateway = reservationGateway;
    }

    async addReservation(courtId: string, userId: string, date: string, time: string) {
        const existReservation = await this.reservationGateway.find(new AddReservationParameter({
            courtId, userId, date, time
        }));
        if (TypeUtils.isNotNone(existReservation)) {
            throw new IllegalArgumentError('This reservation can\'t be recorded.');
        }

        const reservation = await this.reservationGateway.addReservation(new AddReservationParameter({
            courtId, userId, date, time
        }))

        return reservation;
    }
}