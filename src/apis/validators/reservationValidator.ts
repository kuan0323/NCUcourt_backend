import * as compose from 'koa-compose';
import { body, params, query } from './validator';

export default {
    reservationValidator () {
        return compose ([
            body('courtId').isObjectID().required().build(),
            body('date').isString().required().build(),
            body('time').isString().required().build()
        ])
    },

    deleteReservationValidator () {
        return compose([
            params('id').isObjectID().required().build()
        ]);
    }
}