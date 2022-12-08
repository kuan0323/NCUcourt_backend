import * as Koa from 'koa';
import database from './database/mongoDatabase';

<<<<<<< HEAD
<<<<<<< HEAD
let count = 1;
export default {
    async getAdmins (ctx: Koa.Context) {
        const name = ctx.query.name;
        const email = ctx.query.email;
        const collection = await database.getCollection('admins');
        const users = await collection.find({"admin_name" : name, "admin_email" : email}).toArray();
        ctx.body = users;
    },
    
    async createAdmins (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = true
        const id = ++count

        const createdTime = new Date();
        const collection = await database.getCollection('admins');
        const result = await collection.insertOne({admin_id:count,admin_name: name, admin_email: email, admin_password : password, admin_phone : phone, admin_created_Time : createdTime,admin_status : status});
        ctx.body = result.ops[0];
    }
=======
export default {
    // async getAdmins (ctx: Koa.Context) {
=======
// export default {
       // what superAdmin can do
       // get all Admin
       // get 
//     async getAdmins (ctx: Koa.Context) {
>>>>>>> a641c76146a880b9544fcc36981953b1e751606d
        
    // }

    async createAdmins (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = ctx.request.body.status;
>>>>>>> tj

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        const collection = await database.getCollection('admins');

        const result = await collection.insertOne({admin_name: name, admin_email: email, admin_password : password, admin_phone : phone,  admin_createdTime : createdTime,admin_status : status});
        ctx.body = result.ops[0];
    }

    // async editAdmins (ctx: Koa.Context) {

<<<<<<< HEAD
//     }
=======
    // }

    // async deleteAdmins (ctx: Koa.Context) {

    // }
>>>>>>> tj
}