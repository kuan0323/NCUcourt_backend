import * as compose from 'koa-compose';
import { body, params, query } from './validator';


export default {
    registerValidator () {
        return compose([
            body('name').isString().required().build(),
            body('email').isString().required().build(),
            body('studentId').isString().required().build(),
            body('password').isString().required().build(),
            body('phone').isString().required().build(),
        ]);
    }
}