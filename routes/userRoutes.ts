export { };
let express = require("express");
let router = express.Router();
let log4js = require("log4js");
const logger = log4js.getLogger("Users Routes");
let usersInterceptor = require("../interceptors/userInterceptor");
let usersController = require("../controllers/userController")

logger.debug("Users Routes Initiated");

//route create new user
router.post("/createuser", usersInterceptor.validateUser, usersController.createUser);

router.post("/login", usersInterceptor.loginUser, usersController.loginUser);

router.post("/logout", usersController.logoutUser);

module.exports = router;