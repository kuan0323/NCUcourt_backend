import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {
    loginValidator() {
        return compose ([
            body('studentId').isString().required().build(),
            body('password').isString().required().build(),
        ])
    }
}