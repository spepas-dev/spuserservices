const express = require("express");
const router = express.Router();

//TEST CONTROLLER
const {
    TestController
 } = require("../controllers/test");
 

 const {
    ADD_ACCOUNT
 } = require("../controllers/PaymentAccountController");
 



 const { NoneUserCheck} = require("../middleware/NoneUserMiddleware")
 const { VALIDATE_TOKEN} = require("../middleware/UserMiddleware")
 

//test routes link
router.route("/testapi").get(TestController);


router.route("/payment-account/register").post(NoneUserCheck,VALIDATE_TOKEN,ADD_ACCOUNT);
router.route("/payment-account/profile").post(NoneUserCheck,VALIDATE_TOKEN,ADD_ACCOUNT);



module.exports = router;