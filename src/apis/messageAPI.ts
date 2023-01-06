import * as Koa from 'koa';
import Container from 'typedi';
import database from '../database/mongoDatabase';
import { MessageManager } from '../usecases/messageManager';
import { APIUtils } from './apiUtils';

const messageManager = Container.get(MessageManager);

export default {
    async getMessages (ctx: Koa.Context) {
        try {
            const courtId = APIUtils.getQueryAsString(ctx, 'courtId');
            const message = await messageManager.viewMessage(courtId);
            ctx.body = message;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async createMessages (ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const courtId = APIUtils.getBodyAsString(ctx, 'courtId');
            const content = APIUtils.getBodyAsString(ctx, 'content');
            const message = await messageManager.addMessage({courtId, userId, content});
            ctx.body = message;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async deleteMessages (ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const messageId = APIUtils.getParamsAsString(ctx, 'id');
            await messageManager.deleteMessage(userId, messageId);
            ctx.body = { message: 'the message deleted succesfully.' };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    } 
}