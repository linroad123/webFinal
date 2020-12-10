import { Router } from "../deps.js";
import * as userController from "./controllers/userController.js";
import * as reportController from "./controllers/reportController.js";
import * as userApi from "./apis/userApi.js";
import * as reportApi from "./apis/reportApi.js";

const router = new Router();

router.get('/',reportController.landing);

router.get('/auth/registration', userController.showForm);
router.post('/auth/registration', userApi.setRegister);

router.get('/auth/login', userController.showLogin);
router.post('/auth/login',userApi.authenticate);
router.get('/auth/logout', userApi.logout);

router.get('/behavior/reporting',reportController.chooseTime);
router.get('/morning', reportController.morning);
router.get('/evening', reportController.evening);

router.post('/morning',reportApi.addMorning);
router.post('/evening',reportApi.addEvening);

router.get('/behavior/summary',reportController.defaultSummary);


router.get('/api/summary',reportController.avgSummary);




export { router };