import * as Koa from 'koa';
import Container from 'typedi';
import database from '../database/mongoDatabase';
import { ReservationManager } from '../usecases/reservationManager';
import { APIUtils } from './apiUtils';

const reservationManager = Container.get(ReservationManager);

export default {
    // User can view records
    async getReservations(ctx: Koa.Context) {

        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const reservation = await reservationManager.viewReservation(userId);
            ctx.body = reservation;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }

    },

    async createReservations(ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const courtId = APIUtils.getBodyAsString(ctx, 'courtId');
            const date = APIUtils.getBodyAsString(ctx, 'date');
            const time = APIUtils.getBodyAsString(ctx, 'time');
            const reservation = await reservationManager.addReservation(courtId, userId, date, time);
            ctx.body = reservation;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async deleteReservations(ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const reservationId = APIUtils.getParamsAsString(ctx, 'id');
            await reservationManager.deleteReservation(userId, reservationId);
            ctx.body = { message: 'delete reservation successfully.' };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    }
}