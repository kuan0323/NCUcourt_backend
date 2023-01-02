import * as Koa from 'koa';
import database from '../database/mongoDatabase';
import Container from 'typedi';
import { CourtManager } from '../usecases/courtManager';
import { APIUtils } from './apiUtils';
import { IllegalArgumentError } from '../exceptions/illegalArgumentError';
import TypeUtils from '../libs/typeUtils';

const courtManager = Container.get(CourtManager);

export default {
        async getCourts(ctx: Koa.Context) {
            try {
                const type = APIUtils.getQueryAsString(ctx, 'type', null);
                const name = APIUtils.getQueryAsString(ctx, 'name', null);
                const court = await courtManager.viewCourt(type, name);
                ctx.body = court;
            } catch (e) {
                APIUtils.handleError(ctx, e);
            }
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

    },

        async editCourts (ctx: Koa.Context) {
            try {
                const id = APIUtils.getParamsAsString(ctx, 'id');
                const name = APIUtils.getBodyAsString(ctx, 'name');
                const price = APIUtils.getBodyAsString(ctx, 'price');
                const type = APIUtils.getBodyAsString(ctx, 'type');
                const photoContent = TypeUtils.isNotNone(ctx.file) ? ctx.file.buffer : null
                const court = await courtManager.editCourt(id, name, price, type, photoContent);
                // ctx.body = court;
                ctx.body = { message: 'update court successfully.' };
            } catch (e) {
                APIUtils.handleError(ctx, e);
            }

            // const photo = ctx.request.body.photo;
            // const price = ctx.request.body.price;
            // //const beReserved = ctx.request.body.beReserved;
            // const type = ctx.request.body.type;

            // const name = ctx.request.body.name;
            // const collection = await database.getCollection("courts");
            // ctx.request.body.lastModified = new Date();
            // const lastModified = ctx.request.body.lastModified;

            //   //check if the target exist
            // if ((await collection.find({ name: name }).toArray()).length ===0) {
            //     ctx.body = "Warning: Can't find the court!";
            // } else {
            //     await collection.updateOne({ name: name },{
            //         $set: {
            //             photo: photo,
            //             price: price,
            //             beReserved: true,
            //             type: type,
            //             lastModified: lastModified,
            //         },
            //     });
            //     ctx.body = await collection.find({ name: name }).toArray();
            // }
    },

	async deleteCourts(ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const courtId = APIUtils.getParamsAsString(ctx, 'id');
            await courtManager.deleteCourt(userId, courtId);
            ctx.body = { message: 'the court deleted successfully.' };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    }
};