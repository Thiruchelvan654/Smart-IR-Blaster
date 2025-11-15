const express = require("express");
const router = express.Router();
const projectorController = require("../controllers/projector.controller");

router.get("/", projectorController.getAllProjectors);
router.get("/:id", projectorController.getProjectorById);
router.post("/", projectorController.createProjector);
router.put("/:id", projectorController.updateProjector);
router.delete("/:id", projectorController.deleteProjector);

module.exports = router;