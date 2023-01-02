import * as Router from 'koa-router';
import reservationAPI from "./apis/reservationAPI";
import authAPI from "./apis/authAPI";
import userAPI from "./apis/userAPI";
import courtAPI from "./apis/courtAPI";
import messageAPI from "./apis/messageAPI";
import userValidator from './apis/validators/userValidator';
import courtValidator from './apis/validators/courtValidator';
import reservationValidator from './apis/validators/reservationValidator';
import messageValidator from './apis/validators/messageValidator';
import authValidator from './apis/validators/authValidator';
import multer = require('@koa/multer');

export default (router: Router) => {
    router.post('/api/auth/login', authValidator.loginValidator(), authAPI.login);
    router.post('/api/register', userValidator.registerValidator(), userAPI.register);

    router.get('/api/users/profile', authAPI.verifyServiceToken, userAPI.getSelfUser);
    router.get('/api/users', authAPI.verifyServiceToken, userAPI.getUsers);

    router.put('/api/users', authAPI.verifyServiceToken, userAPI.editUsers);
    router.delete('/api/users', authAPI.verifyServiceToken, userAPI.deleteUsers);

    router.get('/api/reservations', authAPI.verifyServiceToken, reservationAPI.getReservations);
    router.post('/api/reservations', authAPI.verifyServiceToken, reservationValidator.reservationValidator(), reservationAPI.createReservations);
    router.put('/api/reservations', authAPI.verifyServiceToken, reservationAPI.editReservations);
    router.delete('/api/reservations', authAPI.verifyServiceToken, reservationAPI.deleteReservations);

    router.get('/api/courts', authAPI.verifyServiceToken, courtAPI.getCourts);
    router.post('/api/courts', authAPI.verifyServiceToken, multer().single('photo'), courtValidator.courtValidator(), courtAPI.createCourts);
    router.put('/api/courts/:id', authAPI.verifyServiceToken, multer().single('photo'), courtAPI.editCourts);
    router.delete('/api/courts', authAPI.verifyServiceToken, courtAPI.deleteCourts);

    router.get('/api/messages', messageValidator.viewMessageValidator(), authAPI.verifyServiceToken, messageAPI.getMessages);
    router.post('/api/messages', messageValidator.messageValidator(), authAPI.verifyServiceToken, messageAPI.createMessages);
    router.put('/api/messages', authAPI.verifyServiceToken, messageAPI.editMessages);
    router.delete('/api/messages', authAPI.verifyServiceToken, messageAPI.deleteMessages);

    // post
    // put
    // delete

    // HTTP pass argument
    // 1. query string
    // 2. path parameter
    // 3. post body
    
    //git commit -m "text"
    //git push <rep> tj
}