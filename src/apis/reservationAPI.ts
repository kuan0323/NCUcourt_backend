import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {
        ctx.body = {};
    },

    async createReservations (ctx: Koa.Context) {
        const court = ctx.request.body.court;
        const student = ctx.request.body.student;
        const email = ctx.request.body.email;
        const phone = ctx.request.body.phone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const collection = await database.getCollection("reservations");

        // let id = await collection.find().count();

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        
        if( 
            (await collection.find({ 
                reservation_court_name: court,
                reservation_date: date,
                reservation_time: time,
            }).toArray()).length === 0
        ){
        const result = await collection.insertOne({
            courtName : court, 
            studentId: student,
            studentEmail: email, 
            studentPhone: phone, 
            createdTime: createdTime,
            date: date,
            time: time
        });

        ctx.body = result.ops[0];
        }
    },

    async editReservations (ctx: Koa.Context) {
        
        const student = ctx.request.body.student;
        const email = ctx.request.body.email;
        const phone = ctx.request.body.phone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const id_keyword = ctx.request.body.id_keyword;

        const collection = await database.getCollection("reservations");
    // }

    // async editReservations (ctx: Koa.Context) {

    // }

    // async deleteReservations (ctx: Koa.Context) {

    // }
}