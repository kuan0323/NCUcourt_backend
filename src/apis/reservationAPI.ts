import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {
        ctx.body = {};
    }

    // async createReservations (ctx: Koa.Context) {

    // }

    // async editReservations (ctx: Koa.Context) {

    // }

    // async deleteReservations (ctx: Koa.Context) {

    // }
}