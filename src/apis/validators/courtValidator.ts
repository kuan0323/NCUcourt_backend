import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {
    courtValidator() {
        return compose ([
            body('name').isString().required().build(),
            body('price').isString().required().build(),
            body('type').isString().in(['badminton', 'basketball', 'tennis', 'volleyball']).required().build()
        ])
    },

    deleteCourtValidator () {
        return params('id').isObjectID().required().build()
    }
}