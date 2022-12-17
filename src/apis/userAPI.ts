import * as Koa from 'koa';
import database from '../database/mongoDatabase';
const hashMethod = require('crypto');

export default {

    async getUsers (ctx: Koa.Context) {
        const sortby = ctx.query.sortby;
        const role = ctx.query.role;
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

        
        if (  role != "regular" && role != "admin" && role != "superAdmin" && sortby === undefined && role === undefined) {
            ctx.body = " No such identity, please re-enter.... ";
        }else if( role === "regular" || role === "admin" || role === "superAdmin" ) {
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
        const role = "regular";

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

        if ( (await collection.find({ studentId: studentId }).toArray()).length ===0){
            const result = await collection.insertOne({name: name, studentId : studentId, email: email, password : hashPwd, phone : phone, createdTime : createdTime, role: role});
            ctx.body = result.ops[0];
        }else {
            ctx.body = "This studentId was been register";
        }
        
        
    },

    async editUsers (ctx: Koa.Context) {
        const studentId = ctx.request.body.studentId;
        const email = ctx.request.body.email;
        const oldPassword = ctx.request.body.oldPassword;
        const newPassword = ctx.request.body.newPassword;
        const phone = ctx.request.body.phone;

        const name = ctx.request.body.name;
        ctx.request.body.lastModified = new Date();
        const lastModified = ctx.request.body.lastModified;
        const collection = await database.getCollection("users");
        
        //hash newPassword 
        const hashPwd = hashMethod.createHash('sha256')
        .update(newPassword)
        .digest('hex');

        //hash oldpassword 
        const hashOldPwd = hashMethod.createHash('sha256')
        .update(oldPassword)
        .digest('hex');
        
        if ((await collection.find({ name: name }).toArray()).length ===0) {
            ctx.body = "Warning: Can't find the user!";
        } else if((await collection.find({ password: hashOldPwd ,name : name}).toArray()).length ===0){
            ctx.body = "your old password is incorrect, please try again";
        } else if ( (await collection.find({ studentId: studentId }).toArray()).length ===0){
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
        } else {
            ctx.body = "This studentId was been register";
        }


    },

    async deleteUsers (ctx: Koa.Context) { 
        const userId = ctx.state.user;
        console.log(userId);
        const collection = await database.getCollection("users");

        // check if the target exist
        if ((await collection.find({ _id: userId }).toArray()).length ===0) {
            ctx.body = "Warning: Can't find the user!";
        } else {
            await collection.deleteOne({ _id: userId });
            ctx.body = "The user had been deleted";
        }
    }



}


// HTTP request method
// get 取得資料
// post 新增資料
// put 更新資料
// delete 刪除資料