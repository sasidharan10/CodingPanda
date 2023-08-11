const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const { asyncError } = require('../utils/errorHandler');

const adminModel = require("../models/adminModel");

module.exports = router;