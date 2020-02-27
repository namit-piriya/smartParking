
// const mongoPromise = require("../util/mongo_util");

const parkingModel = require("../models/parking");

module.exports.addRemCar = async function(req,res){
    const body  = req.body;
    const parkingId = body.parkingId;
    const sensorId = body.sensorId;
    const isEmpty = body.isEmpty;
    try {
        await parkingModel.changeSensorStatus(parkingId,sensorId,isEmpty);
        res.json({
            success:true,
            error:false,
            msg:"changed successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            error:true,
            msg:"something wrong happened"
        });
    }
};


module.exports.returnAllEmptyparkings = async function(req,res){
    try {
        let result = await parkingModel.returnEmptyParkings();
        arr = [];
        result[0].forEach(element => {
            arr.push(element.parking_name);
        });
        res.json({
            result:arr
        });
    } catch (error) {
        console.log(error);
        res.json({
            error
        });
    }
};