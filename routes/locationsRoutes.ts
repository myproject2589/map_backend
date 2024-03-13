export { };
let express = require("express");
let router = express.Router();
let log4js = require("log4js");
const logger = log4js.getLogger("Users Routes");
let locationsController = require("../controllers/locationsController")

logger.debug("Locations Routes Initiated");

router.get("/getAllLocations", locationsController.getAllLocations);

router.post("/addNewLocation", locationsController.addNewLocation);

router.put("/updateLocations", locationsController.updateLocations);

router.delete("/deleteLocation", locationsController.deleteLocation);

router.post("/addLocation", locationsController.addLocation);

router.get("/shapes", locationsController.getShapes);

router.post("/deleteShape", locationsController.deleteShape);
router.post("/updateShape",locationsController.updateShape)

module.exports = router;