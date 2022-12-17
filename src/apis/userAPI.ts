import * as Koa from 'koa';
import database from '../database/mongoDatabase';
const hashMethod = require('crypto');

export default {

    async getUsers (ctx: Koa.Context) {

        const sortby = ctx.request.body.sortby;
        const role = ctx.request.body.role;
        const collection = await database.getCollection('users');

        if (sortby === "createdTime"){
            const users = await collection.find({}).sort({createdTime : -1}).toArray();
            ctx.body = users;
        }else if (sortby === "lastModified"){
            const users = await collection.find({ lastModified: { $exists: true }}).sort({ lastModified : -1}).toArray();
            ctx.body = users;  
    
        }else if (sortby === "specificName"){
            const name =  ctx.request.body.name;
            const users = await collection.find({ name : name }).toArray();
            ctx.body = users;
        }

        
        if (  role != "regular" && role != "admin" && role != "superadmin" && sortby === undefined && role === undefined) {
            ctx.body = " No such identity, please re-enter.... ";
        }else if( role === "regular" || role === "admin" || role === "superadmin" ) {
            const users = await collection.find({ role : role }).toArray();
            ctx.body = users;
        } 

        if (sortby === undefined && role === undefined){
            const users = await collection.find({}).toArray();
            ctx.body = users;
        }
    

    },

    async register (ctx: Koa.Context) {
        const name = ctx.request.body.name;
        const studentId = ctx.request.body.studentId;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const role = ctx.request.body.role;

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

        if ( role != "regular" && role != "admin" && role != "superadmin") {
            ctx.body = " No such identity, please re-enter.... ";
        }else if ( (await collection.find({ studentId: studentId }).toArray()).length ===0){
            const result = await collection.insertOne({name: name, studentId : studentId, email: email, password : hashPwd, phone : phone, createdTime : createdTime, role: role});
            ctx.body = result.ops[0];
        }else {
            ctx.body = "This studentId is registered";
        }
        
        
    },

    async editUsers (ctx: Koa.Context) {
        const studentId = ctx.request.body.studentId;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;

        const name = ctx.request.body.name;
        ctx.request.body.lastModified = new Date();
        const lastModified = ctx.request.body.lastModified;
        const collection = await database.getCollection("users");
        
        //hash password 
        const hashPwd = hashMethod.createHash('sha256')
        .update(password)
        .digest('hex');
        
        if ((await collection.find({ name: name }).toArray()).length ===0) {
            ctx.body = "Warning: Can't find the user!";
        } else {
            await collection.updateOne({ name: name },{
                $set: {
                    studentId: studentId,
                    email: email,
                    password : hashPwd,
                    phone: phone,
                    lastModified: lastModified,
                },
            });
            ctx.body = await collection.find({ name: name }).toArray();
        } 

    },

    async deleteUsers (ctx: Koa.Context) { 
        const name = ctx.query.name;
        const collection = await database.getCollection("users");

        //check if the target exist
        if ((await collection.find({ name: name }).toArray()).length ===0) {
            ctx.body = "Warning: Can't find the user!";
        } else {
            await collection.deleteOne({ name: name });
            ctx.body = "The user had been deleted";
        }
    }

}


// HTTP request method
// get 取得資料
// post 新增資料
// put 更新資料
// delete 刪除資料