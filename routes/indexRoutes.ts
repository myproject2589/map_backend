export { };
const express = require('express');
const usersRoutes = require('./userRoutes');
const addressRoutes = require('./addressRoutes')
const locationsRoutes = require('./locationsRoutes');
const router = express.Router();

router.use('/users', usersRoutes);

router.use('/address', addressRoutes);

router.use('/locations', locationsRoutes);
router.use('/',usersRoutes)

module.exports = router;