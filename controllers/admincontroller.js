
let ParkingModel = require("../models/parking_model");

module.exports.addParking = async (req, res) => {

    let parkingName = req.body.parkingName;
    let sensors = req.body.sensors;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let address = req.body.address;
    let parking = new ParkingModel(parkingName, sensors, latitude, longitude, address);

    try {
        let result = await parking.addParking();
        return res.json({
            success:true,
            error:false
        })
    } catch (error) {
        console.log(error);
        return res.json({
            error:true,
            msg:"something wrong happened"
        });
    }
};