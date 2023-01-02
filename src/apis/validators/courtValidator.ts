import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {

    getCourtsValidator () {
        return compose ([
            query('name').isString().optional().build(),
            query('type').isString().in(['badminton', 'basketball', 'tennis', 'volleyball']).optional().build()
        ])
    },

    courtValidator() {
        return compose ([
            body('name').isString().required().build(),
            body('price').isString().required().build(),
            body('type').isString().in(['badminton', 'basketball', 'tennis', 'volleyball']).required().build()
        ])
    },

    editCourtValidator () {
        return compose ([
            body('name').isString().optional().build(),
            body('price').isString().optional().build(),
            body('type').isString().in(['badminton', 'basketball', 'tennis', 'volleyball']).optional().build()
        ])
    },

    deleteCourtValidator () {
        return params('id').isObjectID().required().build()
    }
}