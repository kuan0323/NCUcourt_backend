import * as Router from 'koa-router';
import reservationAPI from "./apis/reservationAPI";
import userAPI from "./apis/userAPI";
// import courtAPI from "./apis/courtAPI";
// import adminAPI from "./apis/adminAPI";
// import messageAPI from "./apis/messageAPI";

export default (router: Router) => {
    router.get('/api/getUsers', userAPI.getUsers);
    router.get('/api/users/:id', userAPI.getUsers);
    router.post('/api/register', userAPI.register);

    router.get('/api/loginUsers', userAPI.loginUsers);
    // router.put('/api/editUsers', userAPI.editUsers);
    // router.delete('/api/deleteUsers', userAPI.deleteUsers);

    router.get('/api/reservations', reservationAPI.getReservations);
    // router.post('/api/createReservations', reservationAPI.createReservations);
    // router.put('/api/editReservations', reservationAPI.editReservations);
    // router.delete('/api/deleteReservations', reservationAPI.deleteReservations);

    // router.get('/api/courts', courtAPI.getCourts);
    // router.post('/api/createCourts', courtAPI.createCourts);
    // router.put('/api/editCourts', courtAPI.editCourts);
    // router.delete('/api/deleteCourts', courtAPI.deleteCourts);

    // router.get('/api/admins', adminAPI.getAdmins);
    // router.post('/api/createAdmins', adminAPI.createAdmins);
    // router.put('/api/editAdmins', adminAPI.editAdmins);
    // router.delete('/api/deleteAdmins', adminAPI.deleteAdmins);

    // router.get('/api/messages', messageAPI.getMessages);
    // router.post('/api/createMessages', messageAPI.createMessages);
    // router.put('/api/editMessages', messageAPI.editMessages);
    // router.delete('/api/deleteMessages', messageAPI.deleteMessages);

    // post
    // put
    // delete

    // HTTP pass argument
    // 1. query string
    // 2. path parameter
    // 3. post body
}
