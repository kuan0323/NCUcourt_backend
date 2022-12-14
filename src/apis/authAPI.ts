import * as Koa from 'koa';
import * as jwt from 'jsonwebtoken';
import { Algorithm } from 'jsonwebtoken';
import database from '../database/mongoDatabase';
import config from '../config';

export default {

    async login (ctx: Koa.Context) {
        const studentId = ctx.request.body.studentId;
        const password = ctx.request.body.password;

        // find user
        const collection = await database.getCollection('users');
        const user = await collection.findOne({"studentId" : studentId});

        // verify password
        // If password not correct
        const hashMethod = require('crypto');
        const hashPwd = hashMethod.createHash('sha256')
        .update(password)
        .digest('hex');

        if (hashPwd !== user.password) {
            ctx.response.status = 401;
            ctx.body = { message: 'login failed' };
            return;
        }
        
        const payload = { userId: user._id, signTimestamp: Date.now() };
        // const options = { algorithm: 'HS256' as Algorithm, expiresIn: '30d' };
        const options = { algorithm: 'HS256' as Algorithm };
        const token = jwt.sign(payload, config.secretKey, options);

        ctx.body = { serviceToken: token };

    },

    async verifyServiceToken (ctx: Koa.Context, next: () => Promise<void> | void) {
        const authorization = ctx.headers.authorization
        if (!authorization || authorization.substring(0, 6) !== 'Bearer') {
            ctx.response.status = 401;
            ctx.body = { message: 'invalid token' };
            return;
        }
        const serviceToken = authorization.substring(7);

        try {
            const userTokenData: any = jwt.verify(serviceToken, config.secretKey);
            // 回傳 payload
            const userId = userTokenData.userId || null;
            const lastSignTimestamp = userTokenData.signTimestamp || null;
            if (userId === null || lastSignTimestamp === null) {
                ctx.response.status = 401;
                ctx.body = { message: 'invalid token' };
                return;
            }
            ctx.state.user = userId;
            await next(); // verify 只是一個 middleware
        } catch (e) {
            if (e.name === 'JsonWebTokenError' && e.message === 'invalid token') {
                ctx.response.status = 401;
                ctx.body = { message: 'invalid token' };
                return;
            } else if (e.name === 'TokenExpiredError' && e.message === 'jwt expired') {
                ctx.response.status = 401;
                ctx.body = { message: 'token expired' };
                return;
            } else {
                ctx.response.status = 401;
                ctx.body = { message: `${e.name}: ${e.message}` };
                return;
            }
        }
    }
}