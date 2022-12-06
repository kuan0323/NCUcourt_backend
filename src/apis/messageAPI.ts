import * as Koa from 'koa';
import database from './database/mongoDatabase';

export default {
       // get the messagesss of the court
     async getMessages (ctx: Koa.Context) 
     {
       const keyword = ctx.query.keyword;
       const collection = await database.getCollection('messages');
       const messages = await collection.find( {"court_name" : keyword}).project( {  _id: 0, court_name: 0,}).toArray();
       ctx.body = messages;
     },

     async createMessages (ctx: Koa.Context) 
     {
       const id = ctx.request.body.message_user_id;
       const content = ctx.request.body.message_content;
       const courtname = ctx.request.body.court_name;
        
       //const password = ctx.request.body.password;
       //const phone = ctx.request.body.phone;
       //const status = ctx.request.body.status;
       //const get_auto_increment_id = async (table_name) => {
  
         //      寫死 autoIncrease 為紀錄各個 document 的 auto increment 的 document.
         //     const auto_increment_record_table = 'autoIncrease';
            
         //     // 連接 mongodb
         //     //const db = await CreateDB(process.env.MONGO_DB);
            
         //      獲取此 collection
         //     const db_collection = database.collection('messages');
          
         //     const dbFindOneAndUpdateAsync = promisify(
         //         db_collection.findOneAndUpdate
         //     ).bind(db_collection);
          
         //     先 update 此 table_name 的 last number + 1
         //    const result = await dbFindOneAndUpdateAsync(
         //        { _id: messages },
         //        { $inc: { seqValue: 1 } },
         //        { upsert: true, returnNewDocument: true }
         //    );
          
         //    const seqDoc = result.value;
          
         // 再回傳最新的 last number
         //     return seqDoc ? seqDoc.seqValue : 0;
         // };

        ctx.request.body.createdTime = new Date();
        const createdTime = ctx.request.body.createdTime;
        const collection = await database.getCollection('messages');

        //console.log("test"+collection);
        //var counter = await database.getNextSequence('messages');
        //console.log("test"+counter);
        const result = await collection.insertOne({message_user_id : id, message_content : content, court_name: courtname, createdTime : createdTime});
        
        ctx.body = result.ops[0];
     }

//     async editMessages (ctx: Koa.Context) {

//     }

//     async deleteMessages (ctx: Koa.Context) {

//     }
 }