import { log } from "console";

let log4js = require("log4js");
let locationsDao = require("../dao/locations.dao");
let LocationModel = require("../models/location.model");
let logger = log4js.getLogger("Locations Controller");
const {v4 : uuidv4} = require("uuid")
const Shape = require("../models/shape.model")

module.exports = {
    getAllLocations: getAllLocations,
    addNewLocation: addNewLocation,
    updateLocations: updateLocations,
    deleteLocation: deleteLocation,
    addLocation: addLocation,
    getShapes: getShapes,
    deleteShape: deleteShape,
    updateShape:updateShape
};

//Get all locations
async function getAllLocations(req, res) {
    try {
        logger.debug("Inside getAllLocation...");

        //const locationQuery = { SiteID: 105 };
        const locationQuery = {  };
        const allLocations = await LocationModel.aggregate([{ $match: locationQuery }]);

        const shapeData = await locationsDao.find({ shape: { $in: ['circle', 'marker'] } });
        allLocations.push(...shapeData);

        if (allLocations.length > 0) {
            logger.debug(`Locations fetched successfully: ${allLocations.length}`);
            res.status(200).json(allLocations);
        } else {
            logger.error("Failed to fetch locations...");
            logger.error(allLocations);
            res.status(400).json({ message: "Failed to fetch locations", data: allLocations });
        }
    } catch (error) {
        logger.error("An error occurred while fetching locations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//new API created to insert the new record
async function addNewLocation(req, res) {
    try {
        logger.debug("inside addNew Locations", JSON.stringify(req.body));

        const generateGroupUniqueKey = () => req.body.isGroup ? uuidv4() : null;

        const commonDoc = {
            shape: req.body?.shape,
            isGroup: req.body.isGroup || false,
            groupUniqueKey: generateGroupUniqueKey(),
        };

        let doc;

        if (req.body.shape === 'circle') {
            doc = {
                ...commonDoc,
                circleCenter: req.body?.circleCenter,
                circleRadius: req.body?.circleRadius,
                Name: req.body?.Name
            };
        } else if (req.body.shape === 'marker') {
            doc = {
                ...commonDoc,
                bounds: req.body.bounds,
            };
        } else {
            const locationDocs = req.body.locations.map((location) => {
                const bounds = location.bounds.map((bound, index) => ({
                    [`Latitude${index + 1}`]: bound.lat,
                    [`Longitude${index + 1}`]: bound.lng,
                }));

                return {
                    ...commonDoc,
                    ...bounds.reduce((acc, bound) => ({ ...acc, ...bound }), {}),
                    Name: location.name,
                    Code: location.name,
                    Status: 1,
                    CreatedDate: new Date().toISOString(),
                    CreatedBy: -1,
                    ModifiedDate: new Date().toISOString(),
                    ModifiedBy: -1,
                    Deleted: 0,
                    DeletedDate: new Date().toISOString(),
                    DeletedBy: -1,
                    SiteID: 105,
                };
            });

            const locations = await Promise.all(locationDocs.map(doc => locationsDao.insertOne(doc)));
            return res.json(locations);
        }

        const result = await locationsDao.insertOne(doc);
        return res.json(result);
    } catch (error) {
        logger.error(`Error adding new location: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


//Update Location
async function updateLocations(req, res) {
    try {
        logger.debug("inside update location", JSON.stringify(req.body));

        if (req.body.circleCenter) {
            const updatedLocation = await updateLocationById(req.body.id, {
                circleCenter: req.body?.circleCenter,
                circleRadius: req.body?.circleRadius
            });
            return res.json(updatedLocation);
        }

        const updatedLocations = await Promise.all(req.body.locations.map(async (location) => {
            const bounds = location.bounds.map((bound, index) => ({
                [`Latitude${index + 1}`]: bound.lat,
                [`Longitude${index + 1}`]: bound.lng,
            }));

            const updatedLocation = await updateLocationById(location.id, {
                ...bounds.reduce((acc, bound) => ({ ...acc, ...bound }), {}),
                bounds: JSON.stringify(location?.bounds),
                shape: location?.shape,
                circleCenter: location?.circleCenter,
                circleRadius: location?.circleRadius
            });

            return updatedLocation;
        }));

        // Remove locations
        await removeLocations(req.body.removed_location_ids);

        res.json(updatedLocations);
    } catch (error) {
        logger.error(`Error updating locations: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateLocationById(id, updateFields) {
    

    try {
        const updatedLocation = await Shape.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedLocation) {
            throw new Error("Location not found");
        }

        return updatedLocation;
    } catch (error) {
        logger.error(`Error updating location with ID ${id}: ${error.message}`);
        throw error; 
    }
}

async function removeLocations(locationIds) {
    logger.debug("inside removeLocations");
    if (locationIds?.length) {
        try {
            const locationData = await LocationModel.find({ _id: { $in: locationIds } });
            logger.debug("Locations length", locationData?.length);

            let groupUniqueKeys = locationData?.map(item => item.groupUniqueKey);
            logger.debug('groupUniqueKeys length', groupUniqueKeys?.length);

            if (groupUniqueKeys && groupUniqueKeys !== undefined) {
                const uniqueKeysData = await LocationModel.aggregate([
                    {
                        $match: {
                            groupUniqueKey: { $in: groupUniqueKeys },
                            isGroup: true
                        }
                    }
                ]);

                logger.debug("unqiue keys length", uniqueKeysData?.length);

                uniqueKeysData?.forEach(item => {
                    locationIds.push(item._id);
                });
            }
        } catch (error) {
            console.error("Aggregation Error:", error);
        }

        logger.debug("Removed Location Id's length", locationIds?.length);
        await LocationModel.deleteMany({
            // SiteID: 105,
            _id: { $in: locationIds }
        });
    }
}


//API for delete the location 
async function deleteLocation(req, res) {
    try {
        logger.debug("Inside  deleteLocation", JSON.stringify(req.body));
        logger.debug("Inside  deleteLocation", req.body._id);
        let deleteLocationDetails = await locationsDao.deleteOne({ _id: req.body._id });
        // logger.debug("Deleted location Details...", deleteLocationDetails);
        if (deleteLocationDetails && deleteLocationDetails._id) {
            logger.debug("Location deleted successfully...");
            return res.status(200).json({
                message: "Location deleted successfully.",
            })
        } else {
            logger.error("Failed to delete location");
            logger.error(deleteLocationDetails);
            return res.status(500).json({
                message: "Error in location deletion.",
            })
        }
    } catch (error) {
        logger.error("Failed to delete location...");
        logger.error(error.message);
        return res.status(500).json({
            message: "Error in location deletion.",
        })
    }
}

async function addLocation(req, res) {
    //logger.debug("addLocation Request data", JSON.stringify(req.body));
    try {
        const newShape = await Shape.create(req.body);
        res.json(newShape);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
async function getShapes(req, res) {
    try {
        const shapes = await Shape.find();
        res.json(shapes);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

//API for delete the location 
async function deleteShape(req, res) {
    try {
        //logger.debug("Inside  deleteLocation", JSON.stringify(req.body));
        let predeleteLocationDetails = await Shape.findOne({ _id: req.body._id });
        if(predeleteLocationDetails.isGroup && predeleteLocationDetails.UniqueId){
            let deleteLocationDetails = await Shape.deleteMany({ UniqueId: predeleteLocationDetails.UniqueId });
            logger.debug("Deleted location Details...", deleteLocationDetails);
         res.status(200).json({
                message: "Location deleted successfully.",
            })
        }else{
        let deleteLocationDetails = await Shape.deleteOne({ _id: req.body._id });
        if (deleteLocationDetails) {
            logger.debug("Location deleted successfully...");
             res.status(200).json({
                message: "Location deleted successfully.",
            })
        } else {
            logger.error("Failed to delete location");
            logger.error(deleteLocationDetails);
            return res.status(500).json({
                message: "Error in location deletion.",
            })
        }
    }
    } catch (error) {
        logger.error("Failed to delete location...");
        logger.error(error.message);
        return res.status(500).json({
            message: "Error in location deletion.",
        })
    }
}

//API for Update the shape(cordinates change);
async function updateShape(req,res){
    console.log(req.body,"req.body.shape");
    try{
        let shape=req.body;
        const updatedLocation = await updateLocationById(shape._id, {
            coordinates:shape?.coordinates,
        });
        console.log("location Updated Successfully");
        return res.json(updatedLocation);

    }catch(err){
        console.log(err,"err");
    }
}
