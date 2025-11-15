const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");

router.get("/", logController.getAllLogs);
router.get("/date", logController.getLogsByDate);
router.get("/user/:id", logController.getLogsByUserId);
router.post("/", logController.createLog);
router.delete("/:id", logController.deleteLog);



module.exports = router;