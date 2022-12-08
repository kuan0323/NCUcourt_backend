import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {

    async getUsers (ctx: Koa.Context) {

        // const keyword = ctx.query.keyword;
        // const keyword2 = ctx.query.keyword2;
        const collection = await database.getCollection('users');
<<<<<<< HEAD
        const users = await collection.find({"user_studentID" : keyword, "user_email" : keyword2}).toArray();
=======
        const users = await collection.find({}).toArray();
>>>>>>> a641c76146a880b9544fcc36981953b1e751606d
        // const users = await collection.find({"name" : keyword, "email" : keyword2}).toArray();
        ctx.body = {usersss : users};
    },


    async register (ctx: Koa.Context) {
        const name = ctx.request.body.user_name;
        const studentID = ctx.request.body.user_studentID;
        const email = ctx.request.body.user_email;
        const password = ctx.request.body.user_password;
        const phone = ctx.request.body.user_phone;
        const status = ctx.request.body.user_status;

        // check if name is null
        // if (!name) {
        //     ctx.response.status = 400;
        //     ctx.body = {message : "name should be given"};
        //     return;
        // }
        // check email is already registered
        // if (typeof email !== 'undefined') {
        //     ctx.response.status = 400;
        //     ctx.body = {message : "email already exists!"};
        //     return;
        // }

        // generate date&time
        ctx.request.body.user_created_time = new Date();
        const createdTime = ctx.request.body.user_createdcreated_time;
        const collection = await database.getCollection('users');
        const result = await collection.insertOne({user_name: name, user_studentID : studentID, user_email: email, user_password : password, user_phone : phone, user_status : status, user_created_time : createdTime});
        
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


// HTTP request method
// get 取得資料
// post 新增資料
// put 更新資料
// delete 刪除資料