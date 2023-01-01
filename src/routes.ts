import * as Router from 'koa-router';
import reservationAPI from "./apis/reservationAPI";
import authAPI from "./apis/authAPI";
import userAPI from "./apis/userAPI";
import courtAPI from "./apis/courtAPI";
import messageAPI from "./apis/messageAPI";
import userValidator from './apis/validators/userValidator';
import courtValidator from './apis/validators/courtValidator';


export default (router: Router) => {
    router.post('/api/auth/login', authAPI.login);
    router.post('/api/register', userValidator.registerValidator(), userAPI.register);

    router.get('/api/users', authAPI.verifyServiceToken, userAPI.getUsers);
    router.get('/api/users/:name', userAPI.getUsers);

    // router.get('/api/loginUsers', userAPI.loginUsers);
    router.put('/api/users', authAPI.verifyServiceToken, userAPI.editUsers);
    router.delete('/api/users', authAPI.verifyServiceToken, userAPI.deleteUsers);


    router.get('/api/reservations', authAPI.verifyServiceToken, reservationAPI.getReservations);
    router.post('/api/reservations', authAPI.verifyServiceToken, reservationAPI.createReservations);
    router.put('/api/reservations', authAPI.verifyServiceToken, reservationAPI.editReservations);
    router.delete('/api/reservations', authAPI.verifyServiceToken, reservationAPI.deleteReservations);

    router.get('/api/courts', authAPI.verifyServiceToken, courtAPI.getCourts);
    router.post('/api/courts', courtValidator.courtValidator(), authAPI.verifyServiceToken, courtAPI.createCourts);
    router.put('/api/courts', authAPI.verifyServiceToken, courtAPI.editCourts);
    router.delete('/api/courts', authAPI.verifyServiceToken, courtAPI.deleteCourts);

    router.get('/api/messages', authAPI.verifyServiceToken, messageAPI.getMessages);
    router.post('/api/messages', authAPI.verifyServiceToken, messageAPI.createMessages);
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