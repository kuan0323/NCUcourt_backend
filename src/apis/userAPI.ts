import * as Koa from 'koa';
import { ObjectID } from 'mongodb';
import Container from 'typedi';
import database from '../database/mongoDatabase';
import { UserManager } from '../usecases/userManager';
import { APIUtils } from './apiUtils';

const userManager = Container.get(UserManager);

export default {

    async getSelfUser (ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            ctx.body = await userManager.getSelfUser(userId);
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }  
    },

    async getUsers(ctx: Koa.Context) {
        try {
            const keyword = APIUtils.getQueryAsString(ctx, 'keyword', null);
            const role = APIUtils.getQueryAsString(ctx, 'role', null);
            const sortBy = APIUtils.getQueryAsString(ctx, 'sortBy', null);
            ctx.body = await userManager.searchUsers({ keyword, role, sortBy });
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }

    },
    async register(ctx: Koa.Context) {
        try {
            const name = APIUtils.getBodyAsString(ctx, 'name');
            const studentId = APIUtils.getBodyAsString(ctx, 'studentId');
            const email = APIUtils.getBodyAsString(ctx, 'email');
            const password = APIUtils.getBodyAsString(ctx, 'password');
            const phone = APIUtils.getBodyAsString(ctx, 'phone');
            const user = await userManager.register(name, studentId, email, password, phone);
            ctx.body = user;
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    async editUsers(ctx: Koa.Context) {
        try {
            const id = APIUtils.getAuthUserId(ctx);
            const name = APIUtils.getBodyAsString(ctx, 'name');
            const phone = APIUtils.getBodyAsString(ctx, 'phone');
            const email = APIUtils.getBodyAsString(ctx, 'email');
            const oldPassword = APIUtils.getBodyAsString(ctx, 'oldPassword');
            const newPassword = APIUtils.getBodyAsString(ctx, 'newPassword');
            await userManager.editUser({
                id, name, phone, email, oldPassword, newPassword
            });
            ctx.body = { message: 'update user profile successfully.' };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    },

    // 
    async deleteUsers(ctx: Koa.Context) {
        try {
            const userId = APIUtils.getAuthUserId(ctx);
            const deleteId = APIUtils.getParamsAsString(ctx, 'id');
            await userManager.deleteUser(userId, deleteId);
            ctx.body = { message: "The user had been deleted" };
        } catch (e) {
            APIUtils.handleError(ctx, e);
        }
    }

}


// HTTP request method
// get 取得資料
// post 新增資料
// put 更新資料
// delete 刪除資料