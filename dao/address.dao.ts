let addressModel = require("../models/address.model");

module.exports = {
    addNewAddress: addNewAddress,
    getAddress: getAddress,
    findAddress: findAddress,
    deleteAddress: deleteAddress
};

//insert record
async function addNewAddress(address) {
  console.log("address",address);
  let addressData = new addressModel(address);
  let newAddress = await addressData.save().catch((err) => {
    return err;
  });
  return newAddress;
}

// find record
async function findAddress(query) {
  let addressDetails = await addressModel.findOne(query).catch((err) => {
    return err;
  });
  return addressDetails;
}

// find all Address
async function getAddress(query) {
  let address = await addressModel.find(query).catch((err) => {
    return err;
  });
  return address;
}

//delete Address
async function deleteAddress(query) {
  let deletedAddress = await addressModel.findByIdAndRemove(query).catch((err) => {
    return err;
  });
  return deletedAddress;
}
