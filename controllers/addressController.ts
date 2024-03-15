export { }
let log4js = require("log4js");
let addressDao = require("../dao/address.dao");
let AddressModel = require("../models/address.model");
let logger = log4js.getLogger("Address Controller");

module.exports = {
    addNewAddress: addNewAddress,
    getAllAddress: getAllAddress,
    getAddressById: getAddressById,
    deleteAddress: deleteAddress,
    updateAddress: updateAddress
};

//API to add new Address
async function addNewAddress(req, res) {
    try {
        //logger.debug("inside addNewAddress", JSON.stringify(req.body));
        let addressDetails = req.body;
        let newaddressDetails = await addressDao.addNewAddress(addressDetails);

        if (newaddressDetails && newaddressDetails._id) {
            logger.debug("Address added successfully : " + newaddressDetails._id);
            return res.status(200).json({ message: "Address added successfully." });
        } else {
            throw new Error("Failed to add address.");
        }
    } catch (error) {
        logger.error("Failed to add address.", error);
        return res.status(400).json({ error: "Failed to add address." });
    }
}

//Get all Address
async function getAllAddress(req, res) {
    try {
        logger.debug("Inside getAllAddress..");

        const allAddress = await addressDao.getAddress({});

        if (allAddress.length > 0) {
            logger.debug(`Address Fetched successfully: ${allAddress.length}`);
            res.status(200).json(allAddress);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        logger.error("Failed to fetch Address:", error);
        res.status(404).json({
            message: "Failed to fetch Address",
            error: error.message,
        });
    }
}


async function getAddressById(req, res) {
    try {
        logger.debug("Inside getAddressById", JSON.stringify(req.body));

        const findUserQuery = {
            _id: req.body._id,
        };

        const addressDetails = await addressDao.findAddress(findUserQuery);

        if (addressDetails && addressDetails._id) {
            logger.debug(`Address Details found: ${addressDetails.length}`);
            res.status(200).json({ addressDetails });
        } else {
            throw new Error("Address Details not found");
        }
    } catch (error) {
        logger.error(`Failed to fetch Address Details: ${req.body._id}`, error);
        res.status(404).json({
            message: "Address Details not found",
            error: error.message,
        });
    }
}

//API for delete the Address
async function deleteAddress(req, res) {
    try {
        logger.debug("Inside deleteAddress", JSON.stringify(req.body));

        const deleteaddressDetails = await addressDao.deleteAddress({ _id: req.body._id });

        if (deleteaddressDetails && deleteaddressDetails._id) {
            logger.debug("Address deleted successfully...");
            res.status(200).json({
                message: "Address deleted successfully.",
            });
        } else {
            throw new Error("Failed to delete address");
        }
    } catch (error) {
        logger.error(`Failed to delete address: ${error.message}`);
        res.status(500).json({
            message: "Error in address deletion.",
            error: error.message,
        });
    }
}

async function updateAddress(req, res) {
    try {
        logger.debug("Inside updateAddress", JSON.stringify(req.body));

        const addressDetails = req.body;

        const updatedAddress = await AddressModel.findOneAndUpdate(
            { _id: addressDetails._id },
            {
                $set: {
                    address1: addressDetails?.address1,
                    area: addressDetails?.area,
                    city: addressDetails?.city,
                    state: addressDetails?.state,
                    country: addressDetails?.country,
                    zip: addressDetails?.zip,
                }
            },
            { new: true } 
        );

        if (updatedAddress) {
            logger.debug("Address updated successfully...");
            res.status(200).json({
                message: "Address updated successfully.",
                updatedAddress,
            });
        } else {
            throw new Error("Address not found for update");
        }
    } catch (error) {
        logger.error(`Failed to update address: ${error.message}`);
        res.status(500).json({
            message: "Error in address updation.",
            error: error.message,
        });
    }
}

