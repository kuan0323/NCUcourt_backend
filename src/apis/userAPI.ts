import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default {

    async getUsers (ctx: Koa.Context) {

        // const keyword = ctx.query.keyword;
        // const keyword2 = ctx.query.keyword2;
        const collection = await database.getCollection('users');
        const users = await collection.find({}).toArray();
        // const users = await collection.find({"name" : keyword, "email" : keyword2}).toArray();
        ctx.body = users;
    },


    async register (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const studentID = ctx.request.body.studentID;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = ctx.request.body.status;

        // check if name is null
        if (!name) {
            ctx.response.status = 400;
            ctx.body = {message : "name should be given"};
            return;
        }
        // check email is already registered
        // if (typeof email !== 'undefined') {
        //     ctx.response.status = 400;
        //     ctx.body = {message : "email already exists!"};
        //     return;
        // }

        // generate date&time
        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime
        const collection = await database.getCollection('users');
        const result = await collection.insertOne({name: name, studentID : studentID, email: email, password : password, phone : phone, status : status, createdTime : createdTime});
        
        ctx.body = result.ops[0];
    },

    async loginUsers (ctx: Koa.Context) {
        const email = ctx.query.keyword1;
        const password = ctx.query.keyword2;

        const collection = await database.getCollection('users');
        const users = await collection.find({"name" : email, "email" : password}).toArray();

        ctx.body = users;

    }

    // async deleteUsers (ctx: Koa.Context) { 

    // }

    // async editUsers (ctx: Koa.Context) {

    // }

}