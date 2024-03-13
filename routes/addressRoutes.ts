export { };
let express = require("express");
let router = express.Router();
let log4js = require("log4js");
const logger = log4js.getLogger("Users Routes");
let addressController = require("../controllers/addressController")

logger.debug("Address Routes Initiated");

router.post("/addNewAddress", addressController.addNewAddress);

router.get("/getAllAddress", addressController.getAllAddress);

router.post("/getAddressById", addressController.getAddressById);

router.delete("/deleteAddress", addressController.deleteAddress);

router.put("/updateAddress", addressController.updateAddress);

module.exports = router;
