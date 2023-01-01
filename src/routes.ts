import * as Router from "koa-router";
import reservationAPI from "./apis/reservationAPI";
import authAPI from "./apis/authAPI";
import userAPI from "./apis/userAPI";
import courtAPI from "./apis/courtAPI";
<<<<<<< HEAD
import messageAPI from "./apis/messageAPI";
import userValidator from './apis/validators/userValidator';
import courtValidator from './apis/validators/courtValidator';
import reservationValidator from './apis/validators/reservationValidator';

export default (router: Router) => {
    router.post('/api/auth/login', authAPI.login);
    router.post('/api/register', userValidator.registerValidator(), userAPI.register);

    router.get('/api/users', authAPI.verifyServiceToken, userAPI.getUsers);
    router.get('/api/users/:name', userAPI.getUsers);

    // router.get('/api/loginUsers', userAPI.loginUsers);
    router.put('/api/users', authAPI.verifyServiceToken, userAPI.editUsers);
    router.delete('/api/users', authAPI.verifyServiceToken, userAPI.deleteUsers);


    router.get('/api/reservations', authAPI.verifyServiceToken, reservationAPI.getReservations);
    router.post('/api/reservations',reservationValidator.reservationValidator(), authAPI.verifyServiceToken, reservationAPI.createReservations);
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
=======
// import adminAPI from "./apis/adminAPI";
// import messageAPI from "./apis/messageAPI";

export default (router: Router) => {
  router.get("/api/users", userAPI.getUsers);
  router.get("/api/users/:id", userAPI.getUsers);
  router.post("/api/register", userAPI.register);

  router.get("/api/loginUsers", userAPI.loginUsers);
  // router.put('/api/Users', userAPI.editUsers);
  // router.delete('/api/Users', userAPI.deleteUsers);

  router.get("/api/reservations", reservationAPI.getReservations);
  // router.post('/api/reservations', reservationAPI.createReservations);
  // router.put('/api/reservations', reservationAPI.editReservations);
  // router.delete('/api/reservations', reservationAPI.deleteReservations);

  router.get("/api/courts", courtAPI.getCourts);
  router.post("/api/courts", courtAPI.createCourts);
  router.put("/api/courts", courtAPI.editCourts);
  router.delete("/api/courts", courtAPI.deleteCourts);

  // router.get('/api/admins', adminAPI.getAdmins);
  // router.post('/api/admins', adminAPI.createAdmins);
  // router.put('/api/admins', adminAPI.editAdmins);
  // router.delete('/api/admins', adminAPI.deleteAdmins);

  // router.get('/api/messages', messageAPI.getMessages);
  // router.post('/api/messages', messageAPI.createMessages);
  // router.put('/api/messages', messageAPI.editMessages);
  // router.delete('/api/messages', messageAPI.deleteMessages);
>>>>>>> Fu

  // post
  // put
  // delete

<<<<<<< HEAD
    // HTTP pass argument
    // 1. query string
    // 2. path parameter
    // 3. post body
    
    //git commit -m "text"
    //git push <rep> tj
}
=======
  // HTTP pass argument
  // 1. query string
  // 2. path parameter
  // 3. post body
};
>>>>>>> Fu
