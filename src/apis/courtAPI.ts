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