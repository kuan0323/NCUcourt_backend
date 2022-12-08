import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {
        const input_date = ctx.query.keyword1;
        const input_time = ctx.query.keyword2;
        const collection =  await database.getCollection('reservations');
        //const reservations = await collection.find({}).toArray();
        const reservations = await collection.find({ "reservation_date" : input_date , "reservation_time" : input_time }).toArray();

        ctx.body = reservations;
    },

    async createReservations (ctx: Koa.Context) {
        const court = ctx.request.body.court;
        const student = ctx.request.body.student;
        const email = ctx.request.body.email;
        const phone = ctx.request.body.phone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const collection = await database.getCollection('reservations');

        let id = await collection.find().count();

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;

        
        const result = await collection.insertOne({ reservation_id: ++id, reservation_court_name : court, reservation_studentID: student,
         reservation_student_email: email, reservation_student_phone: phone, reservation_created_time: createdTime,
        reservation_date: date, reservation_time: time});

        ctx.body = result.ops[0];
    }

    // async editReservations (ctx: Koa.Context) {

    // }

    // async deleteReservations (ctx: Koa.Context) {

    // }
}