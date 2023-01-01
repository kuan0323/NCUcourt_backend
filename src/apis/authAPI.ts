import * as Koa from 'koa';
import Container from 'typedi';
import { AuthManager } from '../usecases/authManager';
import { APIUtils } from './apiUtils';

const authManager = Container.get(AuthManager);

export default {
    
    async login (ctx: Koa.Context) {
        try {
            const studentId = APIUtils.getBodyAsString(ctx, 'studentId');
            const password = APIUtils.getBodyAsString(ctx, 'password');
            const serviceToken = await authManager.login(studentId, password);
            ctx.body = { serviceToken };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async verifyServiceToken (ctx: Koa.Context, next: () => Promise<void> | void) {
        try {
            const serviceToken = APIUtils.getServiceToken(ctx);
            const userId = authManager.verifyServiceToken(serviceToken);
            ctx.state.user = userId;
            ctx.user = userId;
            await next();
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    }
}