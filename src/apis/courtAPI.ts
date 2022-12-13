import * as Koa from 'koa';
import database from '../database/mongoDatabase';

export default {
       // get all courts information from the type(ex. basketball) we clicked
       // hint: three type of court (basketball、badminton、volleyball)
       async getCourts(ctx: Koa.Context) {
              const type_keyword = ctx.query.type_keyword;
              const collection = await database.getCollection("courts");
              const courts = await collection.find({ court_type: type_keyword }).toArray();
              ctx.body = courts;
       },
       async createCourts(ctx: Koa.Context) {
              const court_name = ctx.request.body.court_name;
              const court_photo = ctx.request.body.court_photo;
              const court_price = ctx.request.body.court_price;
              const court_status = ctx.request.body.court_status;
              const court_type = ctx.request.body.court_type;

              ctx.request.body.createdTime = new Date();
              const createdTime = ctx.request.body.createdTime;
              const collection = await database.getCollection("courts");

              //check if name is used
              if ((await collection.find({ court_name: court_name }).toArray()).length === 0) {
                     const result = await collection.insertOne({
                     court_name: court_name,
                     court_photo: court_photo,
                     court_price: court_price,
                     court_status: court_status,
                     court_type: court_type,
                     createdTime: createdTime,
                     });
                     ctx.body = result.ops[0];
              } else {
                     ctx.body = "Warning: The court name had been used!";
              }
       },

       async editCourts(ctx: Koa.Context) {
              const court_photo = ctx.request.body.court_photo;
              const court_price = ctx.request.body.court_price;
              const court_status = ctx.request.body.court_status;
              const court_type = ctx.request.body.court_type;

              const name_keyword = ctx.query.name_keyword;
              const collection = await database.getCollection("courts");
              ctx.request.body.lastModified = new Date();
              const lastModified = ctx.request.body.lastModified;

              //check if the target exist
              if ((await collection.find({ court_name: name_keyword }).toArray()).length ===0) {
                     ctx.body = "Warning: Can't find the court!";
              } else {
                     const courts = await collection.updateOne({ court_name: name_keyword },{
                            $set: {
                                   court_photo: court_photo,
                                   court_price: court_price,
                                   court_status: court_status,
                                   court_type: court_type,
                                   lastModified: lastModified,
                            },
                     });
                     ctx.body = await collection.find({ court_name: name_keyword }).toArray();
              }
       },

       async deleteCourts(ctx: Koa.Context) {
              const name_keyword = ctx.query.name_keyword;
              const collection = await database.getCollection("courts");

              //check if the target exist
              if ((await collection.find({ court_name: name_keyword }).toArray()).length ===0) {
                     ctx.body = "Warning: Can't find the court!";
              } else {
                     const deleting = await collection.deleteOne({ court_name: name_keyword });
                     ctx.body = "The court had been deleted";
              }
       },
};