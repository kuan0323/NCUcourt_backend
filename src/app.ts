/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import 'reflect-metadata';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as cors from '@koa/cors';
import * as koaLogger from 'koa-logger';
import binding from './binding';
import routes from './routes';

const app = new Koa();
const router = new Router();

binding();
routes(router);

app.use(cors());
app.use(koaLogger());
app.use(koaBody({parsedMethods:['POST', 'PUT', 'GET', 'DELETE']}));
app.use(router.routes());
app.use(router.allowedMethods());

app.use((ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('src/public/index.html');
    ctx.response.status = 404;
})

app.listen(3005, () => {
    console.log(`Server is listening on port 3005.`);
    app.emit("app_started");
})

export default app;
