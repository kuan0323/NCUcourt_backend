import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default{
    async getAdmins (ctx: Koa.Context) {
        const name = ctx.query.name;
        const email = ctx.query.email;
        const collection = await database.getCollection('admins');
        const users = await collection.find({"admin_name" : name, "admin_email" : email}).toArray();
        ctx.body = users;
    },
    
    async createAdmins (ctx: Koa.Context) {
        const collection = await database.getCollection('admins');
        const name = ctx.request.body.name;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = true;
        
        let id = await collection.find().count();
        

        const createdTime = new Date();

        const result = await collection.insertOne({admin_id:++id ,admin_name: name, admin_email: email, admin_password : password, admin_phone : phone, admin_created_Time : createdTime,admin_status : status});
        ctx.body = result.ops[0]
        
    }
    // async editAdmins (ctx: Koa.Context) {

    // }

    // async deleteAdmins (ctx: Koa.Context) {

    // }
    //最後一筆資料
    //const last =await collection.find({}).sort({_id:-1}).limit(1).toArray();
}
