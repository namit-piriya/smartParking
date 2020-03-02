const mngmntController = require("../controllers/parkingmanagementcontroller");

const router = require("express").Router();

router.post("/add_rem_car",mngmntController.addRemCar);
router.get("/get_parkings",mngmntController.returnAllEmptyparkings);

module.exports = router;