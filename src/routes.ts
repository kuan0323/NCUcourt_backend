import * as Router from 'koa-router';
import reservationAPI from "./apis/reservationAPI";
import userAPI from "./apis/userAPI";
// import courtAPI from "./apis/courtAPI";
import adminAPI from "./apis/adminAPI";
// import messageAPI from "./apis/messageAPI";

export default (router: Router) => {
    router.get('/api/users', userAPI.getUsers);
    router.get('/api/users/:id', userAPI.getUsers);
    router.post('/api/register', userAPI.register);

    // router.get('/api/loginUsers', userAPI.loginUsers);
    // router.put('/api/Users', userAPI.editUsers);
    // router.delete('/api/Users', userAPI.deleteUsers);

    router.get('/api/reservations', reservationAPI.getReservations);
    // router.post('/api/reservations', reservationAPI.createReservations);
    // router.put('/api/reservations', reservationAPI.editReservations);
    // router.delete('/api/reservations', reservationAPI.deleteReservations);

    // router.get('/api/courts', courtAPI.getCourts);
    // router.post('/api/courts', courtAPI.createCourts);
    // router.put('/api/courts', courtAPI.editCourts);
    // router.delete('/api/courts', courtAPI.deleteCourts);

    router.get('/api/admins', adminAPI.getAdmins);
    router.post('/api/admins', adminAPI.createAdmins);
    router.put('/api/admins', adminAPI.editAdmins);
    router.delete('/api/admins', adminAPI.deleteAdmins);

    // router.get('/api/messages', messageAPI.getMessages);
    // router.post('/api/messages', messageAPI.createMessages);
    // router.put('/api/messages', messageAPI.editMessages);
    // router.delete('/api/messages', messageAPI.deleteMessages);

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