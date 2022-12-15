import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default{
    async getAdmins (ctx: Koa.Context) {

        const name = ctx.query.name;
        const email = ctx.query.email;
        const collection = await database.getCollection('admins');
        if ((await collection.find({ "admin_name": name }).toArray()).length === 0
            || (await collection.find({ "admin_email": email }).toArray()).length === 0)
            {
                ctx.body = "Warning: Can't find the admin";
            }
        else{
        const users = await collection.find({"admin_name" : name, "admin_email" : email}).toArray();
        ctx.body = users;
        }

    },
    
    async createAdmins (ctx: Koa.Context) {
        const collection = await database.getCollection('admins');
        const name = ctx.request.body.name;
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;
        const status = true;
        
        if((await collection.find({"admin_name" : name}).toArray()).length===1
            || (await collection.find({"admin_email" : email}).toArray()).length===1)
        {
            ctx.body = "Warning: Can't use this name/email (duplicated)!";
        }
        else{
            const last =await collection.find({}).sort({_id:-1}).limit(1).toArray();
            let id  = Object.values(last[0])[1]+1;
            const createdTime = new Date();
            const result = await collection.insertOne({admin_id:id ,admin_name: name, admin_email: email, admin_password : password, admin_phone : phone, admin_created_Time : createdTime,admin_status : status});
            ctx.body = result.ops[0];
        }
    },
    async editAdmins(ctx: Koa.Context) {
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        const phone = ctx.request.body.phone;

        const name = ctx.query.name;
        const collection = await database.getCollection('admins');
        
        if ((await collection.find({ "admin_name": name }).toArray()).length === 0)
            {
                ctx.body = "Warning: Can't find the admin!";
            } 
            else 
            {
                await collection.updateOne
                (
                    { "admin_name": name },
                    {
                        $set: 
                        {
                            admin_email: email,
                            admin_password: password ,
                            admin_phone: phone,
                        },
                    }
                );
            ctx.body = await collection.find({ "admin_name": name }).toArray();
        }
    },

    async deleteAdmins(ctx: Koa.Context) 
    {
        const name = ctx.query.name;
        const collection = await database.getCollection("admins");

        if("admin0"==name)
        {
            ctx.body = "Warning: Can't delete admi0";
        }
        else
            {
                if ((await collection.find({ admin_name: name }).toArray()).length ===0)
                {
                    ctx.body = "Warning: Can't find the Admin!";
                } 
                else 
                {
                    const deleting = await collection.deleteOne({ admin_name: name });
                    ctx.body = "The Admin was deleted";
                } 
        }
        
    }
}

        
    //最後一筆資料
    //const last =await collection.find({}).sort({_id:-1}).limit(1).toArray();
