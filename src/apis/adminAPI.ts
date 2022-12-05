import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default {
    // async getAdmins (ctx: Koa.Context) {
        
    // }

    async createAdmins (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = ctx.request.body.status;

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        const collection = await database.getCollection('admins');

        const result = await collection.insertOne({admin_name: name, admin_email: email, admin_password : password, admin_phone : phone,  admin_createdTime : createdTime,admin_status : status});
        ctx.body = result.ops[0];
    }

    // async editAdmins (ctx: Koa.Context) {

    // }

    // async deleteAdmins (ctx: Koa.Context) {

    // }
}