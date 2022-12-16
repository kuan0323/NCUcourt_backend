import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
    // User can view records
    async getReservations (ctx: Koa.Context) {

        const studentId = ctx.request.body.studentId;
        const collection =  await database.getCollection('reservations');

        if(studentId === undefined){
            ctx.body = "please enter your studentId";
        }else{
            const reservations = await collection.find({ studentId : studentId }).sort({createdTime : -1}).toArray();
            ctx.body = reservations;
        }  
        
    },

    async createReservations (ctx: Koa.Context) {

        const courtName = ctx.request.body.courtName;
        const studentId = ctx.request.body.studentId;
        const studentEmail = ctx.request.body.studentEmail;
        const studentPhone = ctx.request.body.studentPhone;
        const date = ctx.request.body.date;
        const time = ctx.request.body.time;

        const collection = await database.getCollection("reservations");

        // let id = await collection.find().count();

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        
        if( 
            (await collection.find({ 
                courtName: courtName,
                date: date,
                time: time,
            }).toArray()).length === 0
        ){
        const result = await collection.insertOne({
            courtName : courtName, 
            studentId: studentId,
            studentEmail: studentEmail, 
            studentPhone: studentPhone, 
            createdTime: createdTime,
            date: date,
            time: time
        });

        ctx.body = result.ops[0];
        }
    },

    async editReservations (ctx: Koa.Context) {
        
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

    async deleteReservations (ctx: Koa.Context) {
    
        const courtName = ctx.request.body.courtName;
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