import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
       // get the messagesss of the court
    async getMessages (ctx: Koa.Context) {
        //const courtName = ctx.query.courtName;
        const collection = await database.getCollection('messages');
        //const messages = await collection.find( {courtName : courtName}).project( {  _id: 0, courtName: 0,}).toArray();
        const messages = await collection.find({}).toArray();

        ctx.body = messages;
    },

    async createMessages (ctx: Koa.Context) {
        const messageUserId = ctx.request.body.messageUserId;
        const messageContent = ctx.request.body.messageContent;
        const courtName = ctx.request.body.courtName;
        //const last = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        const collection = await database.getCollection('messages');

        let messageId = await collection.find().count() + 1;
        //let message_id  = Object.values(last[0])[1]+1;//?????
        const createdTime = new Date();

        const result = await collection.insertOne({messageId : messageId, messageUserId : messageUserId, messageContent : messageContent, courtName: courtName, createdTime : createdTime});

        ctx.body = result.ops[0];
    },
    async editMessages (ctx: Koa.Context) {
        const messageContent = ctx.request.body.messageContent;
        const messageId = ctx.request.body.messageId;
        const collection = await database.getCollection('messages');
        //record lastmodified?????

        if ((await collection.find({ messageId : messageId }).toArray()).length === 0) {
            ctx.body = "Warning : Can't find the message!";
        } else {
            await collection.updateOne({ messageId : messageId },{
                $set: {
                    messageContent : messageContent,
                },
            });
                ctx.body = await collection.find({ messageId : messageId }).toArray();
        }

    },

    async deleteMessages (ctx: Koa.Context) {
        const messageId = ctx.request.body.messageId;
        const collection = await database.getCollection('messages');

        if((await collection.find({ messageId : messageId}).toArray()).length === 0) {
            ctx.body = "Warning:Can't find the message!";
        } else {
            await collection.deleteOne({messageId : messageId});
            ctx.body = "The message has been deleted.";
        }
    } 
}