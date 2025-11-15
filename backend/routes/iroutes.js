const express = require("express");
const router = express.Router();

const userroutes = require("./user.routes");
const classroutes = require("./class.routes");
const buttonroutes = require("./button.routes");
const logroutes = require("./log.routes");
const projectorroutes = require("./projector.routes");
router.use("/users", userroutes);
router.use("/class", classroutes);
router.use("/projectors", projectorroutes);
router.use("/buttons", buttonroutes);
router.use("/logs", logroutes);

module.exports = router;