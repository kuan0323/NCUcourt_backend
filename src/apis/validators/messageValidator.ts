import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {
    reservationValidator() {
        return compose ([
            body('courtId').isObjectID().required().build(),
            body('content').isString().required().build(),
        ])
    }
}