const express = require("express");
const router = express.Router();
const buttonController = require("../controllers/button.controller");

router.get("/", buttonController.getAllButtons);
router.get("/projector/:id", buttonController.getAllButtonByProjectorId);
router.get("/:id", buttonController.getButtonById);
router.post("/", buttonController.createButton);
router.put("/:id", buttonController.updateButton);
router.delete("/:id", buttonController.deleteButton);
module.exports = router;
