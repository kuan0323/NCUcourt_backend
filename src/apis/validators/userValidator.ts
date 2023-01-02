import * as compose from 'koa-compose';
import { body, params, query } from './validator';


export default {

    searchUserValidator () {
        return compose([
            query('keyword').isString().optional().build(),
            query('role').isString().in(['regular', 'admin', 'superAdmin']).optional().build(),
            query('sortBy').isString().in(['createdTime', 'lastModified']).optional().build(),
        ]);
    },

    registerValidator () {
        return compose([
            body('name').isString().required().build(),
            body('email').isString().required().build(),
            body('studentId').isString().required().build(),
            body('password').isString().required().build(),
            body('phone').isString().required().build(),
        ]);
    },

    editUserValidator () {
        return compose([
            body('name').isString().optional().build(),
            body('email').isString().optional().build(),
            body('studentId').isString().optional().build(),
            body('oldPassword').isString().optional().build(),
            body('newPassword').isString().optional().build(),
            body('phone').isString().optional().build(),
        ]);
    }
}