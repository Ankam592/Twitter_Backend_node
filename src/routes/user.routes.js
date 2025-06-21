import {Router} from "express";

import { registerUser,loginUser ,registerPage ,loginPage,logoutUser,userProfile,deleteUser,editUser,editPage} from "../controllers/user.controller.js";
import { homePage } from "../controllers/home.controller.js";
import {upload}   from "../middlewares/multer.middlewares.js"
import { uploadFile ,uploadPage,filesPage,deleteFile, downloadFile} from "../controllers/upload.controller.js";
import { AllUsers,searchEmp } from "../controllers/AllUsers.controller.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
import { dashboardPage } from "../controllers/dashboard.controller.js";


const router = Router()

router.route("/").get(homePage)

router.route("/register").post(registerUser);       //inside post add fields method in upload object),
router.route("/registerPage").get(registerPage);                                                                         // serving it at register and it is post request



router.route("/login").post(loginUser);
router.route("/loginPage").get(loginPage);
router.route("/logoutUser").get(logoutUser);


router.route("/userProfile/:email").get(userProfile);

router.route("/searchEmp").post(searchEmp);
router.route("/AllUsers").get(authorizeAdmin,AllUsers);   // authorizing users while going into profiles page as only admins has access

router.route("/editUserPage/:id").get(editPage);
router.route("/editUser").post(editUser);
router.route('/deleteUser/:id').get(deleteUser);


router.route('/deleteFile/:id').get(deleteFile)
router.route('/uploadPage').get(uploadPage);


router.route("/fileUpload").post(upload.single('fileUpload'),uploadFile);

router.route("/filesPage").get(filesPage);
router.route("/downloadFile").get(downloadFile);


router.route("/dashboardPage").get(dashboardPage);


export {router};