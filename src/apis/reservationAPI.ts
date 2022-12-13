import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {
        const input_date = ctx.query.keyword1;
        const input_time = ctx.query.keyword2;
        
        const collection =  await database.getCollection('reservations');
        //const reservations = await collection.find({}).toArray();
        const reservations = await collection.find({ "date" : input_date , "time" : input_time }).toArray();

        ctx.body = reservations;
    },

    async createReservations (ctx: Koa.Context) {
        const court = ctx.request.body.court;
        const studentId = ctx.request.body.userStudentId;
        const email = ctx.request.body.userEmail;
        const phone = ctx.request.body.userPhone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const collection = await database.getCollection("reservations");

        // let id = await collection.find().count();

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        
        if( 
            (await collection.find({ 
                courtName: court,
                date: date,
                time: time,
            }).toArray()).length === 0
        ){
        const result = await collection.insertOne({
            courtName : court, 
            studentId: studentId,
            userEmail: email, 
            userPhone: phone, 
            createdTime: createdTime,
            date: date,
            time: time
        });

        ctx.body = result.ops[0];
        }
    },

    async editReservations (ctx: Koa.Context) {
        
        const studentId = ctx.request.body.studentId;
        const email = ctx.request.body.userEmail;
        const phone = ctx.request.body.userPhone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const courtName = ctx.request.body.courtName;

        const collection = await database.getCollection("reservations");

        if (
            (await collection.find({ courtName: courtName }).toArray()).length ===0
        ) {
            ctx.body = "Warning: Can't find the reservation!";
        } 
        else {
            await collection.updateOne(
            { courtName: courtName },
            {
                $set: {
                    userStudentID: studentId,
                    userEmail: email, 
                    userPhone: phone, 
                    date: date,
                    time: time,
                },
            }
            );
            ctx.body = await collection.find({ courtName: courtName }).toArray();
        }

    },

    async deleteReservations (ctx: Koa.Context) {
    
        const courtName = ctx.request.body.courtName;
        const collection = await database.getCollection("reservations");

        if (
            (await collection.find({ courtName: courtName }).toArray()).length ===
            0
        ) {
            ctx.body = "Warning: Can't find the reservation!";
        } else {
            await collection.deleteOne({ courtName: courtName });
            ctx.body = "The reservation had been deleted";
        }

    }
}