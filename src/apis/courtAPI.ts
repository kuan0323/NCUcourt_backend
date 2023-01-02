import * as Koa from 'koa';
import database from '../database/mongoDatabase';
import Container from 'typedi';
import { CourtManager } from '../usecases/courtManager';
import { APIUtils } from './apiUtils';
import { IllegalArgumentError } from '../exceptions/illegalArgumentError';

const courtManager = Container.get(CourtManager);

export default {
       // get all courts information from the type(ex. basketball) we clicked
       // hint: three type of court (basketball、badminton、volleyball)
        async getCourts(ctx: Koa.Context) {

                const collection = await database.getCollection("courts");
                const courts = await collection.find({ beReserved : true }).toArray();

                ctx.body = courts;
        },
        async createCourts(ctx: Koa.Context) {
            try {
                const name = APIUtils.getBodyAsString(ctx, 'name');
                const price = APIUtils.getBodyAsString(ctx, 'price');
                const type = APIUtils.getBodyAsString(ctx, 'type');
                if (!ctx.file) {
                    throw new IllegalArgumentError('photo file is required');
                }
                const court = await courtManager.addCourt(name, price, type, ctx.file.buffer);
                ctx.body = court;
            } catch (e) {
                APIUtils.handleError(ctx, e);
            }


            //     ctx.request.body.createdTime = new Date();
            //     const createdTime = ctx.request.body.createdTime;
            //     const collection = await database.getCollection("courts");

            //   //check if name is used
            //     if ((await collection.find({ name: name }).toArray()).length === 0) {
            //     	const result = await collection.insertOne({
            //         name: name,
            //         photo: photo,
            //         price: price,
            //         beReserved: true,
            //         type: type,
            //         createdTime: createdTime,
            //         });
            //         ctx.body = result.ops[0];
            //     } else {
            //         ctx.body = "Warning: The court name had been used!";
            //     }
    },

        async editCourts (ctx: Koa.Context) {
            const photo = ctx.request.body.photo;
            const price = ctx.request.body.price;
            //const beReserved = ctx.request.body.beReserved;
            const type = ctx.request.body.type;

            const name = ctx.request.body.name;
            const collection = await database.getCollection("courts");
            ctx.request.body.lastModified = new Date();
            const lastModified = ctx.request.body.lastModified;

              //check if the target exist
            if ((await collection.find({ name: name }).toArray()).length ===0) {
                ctx.body = "Warning: Can't find the court!";
            } else {
                await collection.updateOne({ name: name },{
                    $set: {
                        photo: photo,
                        price: price,
                        beReserved: true,
                        type: type,
                        lastModified: lastModified,
                    },
                });
                ctx.body = await collection.find({ name: name }).toArray();
            }
    },

	async deleteCourts(ctx: Koa.Context) {
        const name = ctx.query.name;
        const collection = await database.getCollection("courts");

        //check if the target exist
        if ((await collection.find({ name: name }).toArray()).length ===0) {
            ctx.body = "Warning: Can't find the court!";
        } else {
            const deleting = await collection.deleteOne({ name: name });
            ctx.body = "The court had been deleted";
        }
    },
};