import * as Koa from 'koa';
import database from '../database/mongoDatabase';
const hashMethod = require('crypto');

export default {

    async getUsers (ctx: Koa.Context) {

        // const keyword = ctx.query.keyword;
        // const keyword2 = ctx.query.keyword2;
        const collection = await database.getCollection('users');
        // const users = await collection.find({"user_studentID" : keyword, "user_email" : keyword2}).toArray();

        const users = await collection.find({}).toArray();
        // const users = await collection.find({"name" : keyword, "email" : keyword2}).toArray();
        ctx.body = users;
    },
    async register (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const studentId = ctx.request.body.studentId;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;

        const hashPwd = hashMethod.createHash('sha256')
        .update(password)
        .digest('hex');

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
        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        const collection = await database.getCollection('users');
        const result = await collection.insertOne({name: name, studentId : studentId, email: email, password : hashPwd, phone : phone, createdTime : createdTime, role: "user"});
        
        ctx.body = result.ops[0];
    },

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