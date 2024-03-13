let locationModel = require("../models/location.model");

module.exports = {
  insertOne: insertOne,
  find: find,
  deleteOne : deleteOne
};

//add new location
async function insertOne(location) {
  let locationData = new locationModel(location);
  let newLocations = await locationData.save().catch((err) => {
    return err;
  });
  return newLocations;
}
// find record
// async function findOne(query) {
//   let userDetails = await locationModel.findOne(query).catch((err) => {
//     return err;
//   });
//   return userDetails;
// }

// find all locations
async function find(query) {
  let locations = await locationModel.find(query).catch((err) => {
    return err;
  });
  return locations;
}

//delete location
async function deleteOne(query) {
  let locationDeleted = await locationModel.findByIdAndRemove(query).catch((err) => {
    return err;
  });
  return locationDeleted;
}
