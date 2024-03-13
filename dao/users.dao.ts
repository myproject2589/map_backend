let express = require("express");
let UserModel = require("../models/users.model");
let tokenModel = require("../models/token.model");

module.exports = {
    insertUser: insertUser,
    findOne:findOne,
    saveToken : saveToken,
    removeToken : removeToken
  };
  
  //add new user 
  async function insertUser(userDetails) {
    let userData = new UserModel(userDetails);
    let newUser = await userData.save().catch((err) => {
      return err;
    });
    return newUser;
  }

  // find User
async function findOne(query) {
  console.log(query,"query");
    let userDetails = await UserModel.findOne(query).catch((err) => {
      console.log(err,"err");
      return err;
    });
    return userDetails;
  }

async function saveToken(query) {
    let tokenData = new tokenModel(query);
    await tokenData.save().catch((err) => {
        return err;
    });
    return "token saved...";
}

async function removeToken(query) {
    let tokenRemoved = await tokenModel.deleteMany(query).catch((err) => {
        return err;
      });
      return tokenRemoved;
}