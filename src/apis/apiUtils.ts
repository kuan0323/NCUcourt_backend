import * as Koa from "koa";
import { AuthError } from "../exceptions/authError";
import { IllegalArgumentError } from '../exceptions/illegalArgumentError';
import { NotExistError } from "../exceptions/notExistError";
import { PermissionError } from "../exceptions/permissionError";
import TypeUtils from "../libs/typeUtils";

export class APIUtils {

    static getMemeToken (ctx: Koa.Context): string {
        const authorization = ctx.headers.authorization
        if (!authorization || authorization.substring(0, 6) !== 'Bearer') {
            throw new AuthError('token format should be "Bearer <jwt token>"');
        }
        return authorization.substring(7);
    }

    static getAuthUserId (ctx: Koa.Context): string {
        return ctx.state.user || ctx.user;
    }

    static getQueryAsString (ctx: Koa.Context, name: string, defaultValue = ''): string {
        if (Array.isArray(ctx.query[name])) {
            return ctx.query[name][0];
        } else if (TypeUtils.isNotNone(ctx.query[name])) {
            return ctx.query[name].toString();
        } else return defaultValue;
    }

    static getQueryAsStringArray (ctx: Koa.Context, name: string): string[] {
        const value = ctx.query[name];
        if (Array.isArray(value)) return value.map(v => v.toString());
        else return [value.toString()];
    }

    static getQueryAsNumber (ctx: Koa.Context, name: string, defaultValue = 0): number {
        return parseInt(ctx.query[name] as string) || defaultValue;
    }

    static getBodyAsString (ctx: Koa.Context, name: string): string {
        if (TypeUtils.isNotNone(ctx.request.body[name])) return ctx.request.body[name].toString();
        else return null;
    }

    static getBodyAsBoolean (ctx: Koa.Context, name: string, defaultValue = false): boolean {
        if (TypeUtils.isNotNone(ctx.request.body[name])) return ctx.request.body[name] === 'true' || ctx.request.body[name] === true;
        else return defaultValue;
    }

    static getBodyAsNumber (ctx: Koa.Context, name: string, defaultValue = 0): number {
        return parseInt(ctx.request.body[name] as string) || defaultValue;
    }

    static getBodyAsStringArray (ctx: Koa.Context, name: string): string[] {
        const value = ctx.request.body[name];
        if (!value) return null;
        if (Array.isArray(value)) return value.map(v => v.toString());
        else return [value.toString()];
    }

    static getParamsAsString (ctx: Koa.Context, name: string): string {
        return ctx.params[name].toString();
    }

    static handleError (ctx: Koa.Context, error: Error) {
        if (error instanceof IllegalArgumentError) {
            ctx.status = 400;
            ctx.body = { message: error.message, code: 40000 };
        } else if (error instanceof AuthError) {
            ctx.status = 401;
            ctx.body = { message: error.message, code: 40100 };
        } else if (error instanceof PermissionError) {
            ctx.status = 403;
            ctx.body = { message: error.message, code: 40300 };
        } else if (error instanceof NotExistError) {
            ctx.status = 404;
            ctx.body = { message: error.message, code: 40400 };
        } else {
            console.error(error);
            ctx.status = 500;
            ctx.body = { message: 'internal server error', code: 50000 };
        }
    }
}
