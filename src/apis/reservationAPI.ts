import * as Koa from 'koa';
import Container from 'typedi';
import database from '../database/mongoDatabase';
import { ReservationManager } from '../usecases/reservationManager';
import { APIUtils } from './apiUtils';

const reservationManager = Container.get(ReservationManager);

export default {
    // User can view records
    async getReservations(ctx: Koa.Context) {

        const studentId = ctx.query.studentId;
        const collection = await database.getCollection('reservations');

        if (studentId === "") {
            const reservations = await collection.find({}).sort({ createdTime: -1 }).toArray();
            ctx.body = reservations;
        } else {
            const reservations = await collection.find({ studentId: studentId }).sort({ createdTime: -1 }).toArray();
            ctx.body = reservations;
        }

    },

    async createReservations(ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const courtId = APIUtils.getBodyAsString(ctx, 'courtId');
            const date = APIUtils.getBodyAsString(ctx, 'date');
            const time = APIUtils.getBodyAsString(ctx, 'time');
            // TODO: the format of date and time should be validate
            // TODO: the range of date is only valid in the next 7 days
            const reservation = await reservationManager.addReservation(courtId, userId, date, time);
            ctx.body = reservation;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async editReservations(ctx: Koa.Context) {

        const courtName = ctx.request.body.courtName;
        const studentId = ctx.request.body.studentId;
        const studentEmail = ctx.request.body.studentEmail;
        const studentPhone = ctx.request.body.studentPhone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;


        const collection = await database.getCollection("reservations");

        if (
            (await collection.find({ courtName: courtName }).toArray()).length === 0
        ) {
            ctx.body = "Warning: Can't find the reservation!";
        }
        else {
            await collection.updateOne(
                { courtName: courtName },
                {
                    $set: {
                        studentId: studentId,
                        studentEmail: studentEmail,
                        studentPhone: studentPhone,
                        date: date,
                        time: time,
                    },
                }
            );
            ctx.body = await collection.find({ courtName: courtName }).toArray();
        }

    },

    async deleteReservations(ctx: Koa.Context) {

        //courtNum = ctx.query.courtNmae; 刪除的球場編號
        const courtName = ctx.query.courtName;
        const collection = await database.getCollection("reservations");

        if (
            (await collection.find({ courtName: courtName }).toArray()).length === 0
        ) {
            ctx.body = "Warning: Can't find the reservation!";
        } else {
            await collection.deleteOne({ courtName: courtName });
            ctx.body = "The reservation had been deleted";
        }

    }
}