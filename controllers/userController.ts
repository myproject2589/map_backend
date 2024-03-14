export { }
let log4js = require("log4js");
const bcrypt = require("bcrypt");
const config = require("config");
let usersDao = require("../dao/users.dao");
let tokenService = require("../services/token.service");
let logger = log4js.getLogger("Users Controller");
const validApiKeys = config.get("validApiKeys");

module.exports = {
    createUser: createUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    blankRout:blankRout
};
async function blankRout(req, res) {
    res.send("test");
}
//Create user
async function createUser(req, res) {
    try {
       
        const apiKey = req.headers['api-key'];
        const userDetails = req.body;
        // logger.debug("inside createUser",apiKey);
        // if (apiKey !== validApiKeys) {
        //     return res.status(401).json({ error: 'Invalid API key.' });
        // }

        userDetails.password = encryptPassword(userDetails.password);
        logger.debug("inside createUser userDetails",userDetails);
        const newUserDetails = await usersDao.insertUser(userDetails);
        logger.debug("inside createUser",newUserDetails);
        if (newUserDetails && newUserDetails._id) {
            logger.debug(`User created successfully: ${newUserDetails._id}`);
            return res.status(201).json({ message: 'User created successfully.' });
        } else {
            logger.error('Failed to create user.');
            return res.status(500).send('Failed to create user.');
        }
    } catch (error) {
        logger.error('An error occurred during user creation:', error);
        return res.status(500).send('Internal Server Error.');
    }
}


//Login user
async function loginUser(req, res) {
    try {
        
        logger.debug("Initiated login user");

        const findUserQuery = {
            email: req.body.email,
        };

        console.log("harish",findUserQuery);
        const userDetails = await usersDao.findOne(findUserQuery);
        console.log("harish",userDetails);

        if (userDetails && userDetails._id) {
            logger.debug("User details found");

            const isPasswordMatched = await bcrypt.compare(req.body.password, userDetails.password);
            logger.debug("isPasswordMatched", isPasswordMatched);
            
            if (isPasswordMatched) {
                logger.debug("User login successful: " + req.body.email);
                delete req.body.password;
                const token = tokenService.createToken(userDetails);
                logger.debug("Token", token);

                const tokenObj = {
                    email: req.body.email,
                    token: token
                };
                await usersDao.saveToken(tokenObj);
                const response = {
                    message: "User logged in successfully.",
                    user: userDetails,
                    token: token,
                    status: 200
                };

                return res.status(200).json({
                    response: response,
                });
            } else {
                logger.error("User login failed: " + req.body.email);
                throw new Error("Invalid Credentials");
            }
        } else {
            logger.error("User login failed: " + req.body.email);
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        logger.error("An error occurred during user login:", error.message);
        return res.status(400).json({
            response: { message: "Invalid Credentials" },
        });
    }
}

// Route for the logout API
async function logoutUser(req, res) {
    try {
        logger.debug("Initiated logout", req.body);
        const result = await usersDao.removeToken({ email: req.body.email });
        logger.debug(result);
        if (result) {
            logger.debug(`Logout successful for user: ${req.body.email}`);
            return res.status(200).json({
                message: "Logout successful",
                status: 200
            });
        } else {
            logger.error(`Failed to remove token for user: ${req.body.email}`);
            throw new Error("Logout failed");
        }
    } catch (error) {
        logger.error("An error occurred during user logout:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500
        });
    }
}

//password encrypt
function encryptPassword(plainTextPassword) {
    logger.debug("inside encryptPassword")
    let saltRounds = config.get("saltRounds");
    const hashPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
    return hashPassword;
}

//password compare
function comparePassword(plainTextPassword, hashPassword) {
    let isPasswordCorrect = bcrypt.compareSync(plainTextPassword, hashPassword);
    return isPasswordCorrect;
}
