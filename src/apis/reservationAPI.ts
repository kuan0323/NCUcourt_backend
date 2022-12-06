import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {
        //const keyword = ctx.query.keyword;
        const collection =  await database.getCollection('reservations');
        const reservations = await collection.find({}).toArray();
        //const reservations = await collection.find({ "reservation_studentID" : keyword }).toArray();

        ctx.body = reservations;
    }

    // async createReservations (ctx: Koa.Context) {

    // }

    // async editReservations (ctx: Koa.Context) {

    // }

    // async deleteReservations (ctx: Koa.Context) {

    // }
}