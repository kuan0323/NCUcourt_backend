import { Inject, Service } from "typedi";
import { IllegalArgumentError } from "../exceptions/illegalArgumentError"
import TypeUtils from "../libs/typeUtils"
import { ReservationGateway } from "../adapters/data_access/reservationGateway";
import { AddReservationParameter } from "../adapters/data_access/parameters/addReservationParameter";
import { SearchReservationParameter } from "../adapters/data_access/parameters/searchReservationParameter";
import { UserGateway } from "../adapters/data_access/userGateway";
import { PermissionError } from "../exceptions/permissionError";


@Service()
export class ReservationManager {
    @Inject('ReservationService')
    private reservationGateway: ReservationGateway;
    @Inject('UserService')
    private userGateway: UserGateway;
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
            courtId, date, time
        }));

        if (existReservation.length !== 0) {
            throw new IllegalArgumentError('This reservation can\'t be recorded.');
        }

        const reservation = await this.reservationGateway.addReservation(new AddReservationParameter({
            courtId, userId, date, time
        }));

        return reservation;
    }

    async viewReservation({userId, courtId, date, time}: {userId: string, courtId: string, date: string, time: string}) {
        const user = await this.userGateway.findById(userId);

        const parameter = (user.role === 'admin' || user.role === 'superAdmin')
            ? new SearchReservationParameter({date, time, courtId})
            : new SearchReservationParameter({userId, date, time, courtId})
        
        const reservations = await this.reservationGateway.find(parameter);
        
        return reservations;
    }

    async viewAllReservation({courtId, date, time}: {courtId: string, date: string, time: string}) {
        const reservations = await this.reservationGateway.find(new SearchReservationParameter({date, time, courtId}));
        return reservations;
    }

    async deleteReservation (userId: string, reservationId: string) {
        const user = await this.userGateway.findById(userId);
        const reservation = await this.reservationGateway.findById(reservationId);

        if (TypeUtils.isNone(reservation)) {
            throw new IllegalArgumentError('the reservation is not exist.')
        }
        
        if (user.role !== 'admin' && user.role !== 'superAdmin'
            && user.id !== reservation.user.id) {
            throw new PermissionError('no permission to delete this reservation.')
        }
        await this.reservationGateway.deleteReservation(reservationId);
    }
}