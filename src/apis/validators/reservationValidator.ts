import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {
    reservationValidator() {
        return compose ([
            body('courtId').isString().required().build(),
            body('userId').isString().required().build(),
            body('date').isString().required().build(),
            body('time').isString().required().build()
        ])
    }
}