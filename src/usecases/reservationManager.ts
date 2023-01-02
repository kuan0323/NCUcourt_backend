import { Inject, Service } from "typedi";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError"
import TypeUtils from "../libs/typeUtils"
import { ReservationGateway } from "../adapters/data_access/reservationGateway";
import { AddReservationParameter } from "../adapters/data_access/parameters/addReservationParameter";
import { SearchReservationParameter } from "../adapters/data_access/parameters/searchReservationParameter";


@Service()
export class ReservationManager {
    @Inject('ReservationService')
    private reservationGateway: ReservationGateway;
    private VALID_TIME = ['8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    constructor (reservationGateway: ReservationGateway) {
        this.reservationGateway = reservationGateway;
    }

    private isValidTime (time: string): boolean {
        return this.VALID_TIME.includes(time);
    }

    private isValidDate (date: string): boolean {
        const dateRegex = /^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
        return TypeUtils.isNotNone(date.match(dateRegex));
    }

    async addReservation(courtId: string, userId: string, date: string, time: string) {

        if (!this.isValidTime(time)) {
            throw new IllegalArgumentError(`time should be a value in [${this.VALID_TIME}]`);
        }

        if (!this.isValidDate(date)) {
            throw new IllegalArgumentError(`date should be in format "yyyy/mm/dd"`);
        }

        const existReservation = await this.reservationGateway.find(new SearchReservationParameter({
            courtId, userId, date, time
        }));

        if (existReservation.length !== 0) {
            throw new IllegalArgumentError('This reservation can\'t be recorded.');
        }

        const reservation = await this.reservationGateway.addReservation(new AddReservationParameter({
            courtId, userId, date, time
        }));

        return reservation;
    }
}