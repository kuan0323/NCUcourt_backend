import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
       // get the messagesss of the court
     async getMessages (ctx: Koa.Context) 
     {
       const keyword = ctx.query.keyword;
       const collection = await database.getCollection('messages');
       const messages = await collection.find( {"courtName" : keyword}).project( {  _id: 0, courtName: 0,}).toArray();
       ctx.body = messages;
     },

     async createMessages (ctx: Koa.Context) 
     {
       const collection = await database.getCollection('messages');
       const id = ctx.request.body.messageUserId;
       const content = ctx.request.body.messageContent;
       const courtname = ctx.request.body.courtName;
       //const last = await collection.find({}).sort({_id:-1}).limit(1).toArray();
       let message_id = await collection.find().count() + 1;
       //let message_id  = Object.values(last[0])[1]+1;//?????
       const createdTime = new Date();
       
       const result = await collection.insertOne({messageId : message_id, messageUserId : id, messageContent : content, courtName: courtname, createdTime : createdTime});
       ctx.body = result.ops[0];
     },

     async editMessages (ctx: Koa.Context) 
     {
       const content = ctx.request.body.messageContent;

       const message_id = ctx.query.messageId;
       const collection = await database.getCollection('messages');
       //record lastmodified?????

       if((await collection.find({"messageId" : message_id}).toArray()).length === 0)
       {
              ctx.body = "Warning:Can't find the message!";
       }
       else
       {
          await collection.updateOne
          (
              {"messageId" : message_id},
              {
                     $set:
                     {
                            messageContent : content,
                     },
              }
          );
          ctx.body = await collection.find({ "messageId" : message_id }).toArray();
       }
     },

     async deleteMessages (ctx: Koa.Context) 
     {
       const message_id = ctx.query.messageId;
       const collection = await database.getCollection('messages');

       if((await collection.find({"messageId" : message_id}).toArray()).length === 0)
       {
              ctx.body = "Warning:Can't find the message!";
       }
       else
       {
              const deleting = await collection.deleteOne({messageId : message_id});
              ctx.body = "The message has been deleted.";
       }

     } 
 }