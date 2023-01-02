import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {

    viewMessageValidator () {
        return compose ([
            query('courtId').isObjectID().required().build()
        ])
    },

    messageValidator() {
        return compose ([
            body('courtId').isObjectID().required().build(),
            body('content').isString().required().build(),
        ])
    }
}