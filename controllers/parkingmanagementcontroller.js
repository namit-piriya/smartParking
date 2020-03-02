
const parkingModel = require("../models/parking_model");
const userModel = require("../models/user_model");

module.exports.addRemCar = async function (req, res) {
    const body = req.body;
    const parkingId = body.parkingId;
    const sensorId = body.sensorId;
    const isEmpty = body.isEmpty;

    try {
        await parkingModel.changeSensorStatus({
            parkingId: parkingId,
            sensorId: sensorId,
            isEmpty: isEmpty
        });
        res.json({
            success: true,
            error: false,
            msg: "changed successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            error: true,
            msg: "something wrong happened"
        });
    }
};


module.exports.returnAllEmptyparkings = async function (req, res) {
    try {
        let emptyParkings = await parkingModel.returnEmptyParkings();
        return res.json({
            result: emptyParkings
        });
    } catch (error) {
        console.log(error);
        return res.json({
            err: true,
            msg: "something wrong happened"
        });
    }
};
module.exports.bookSlot = async (req, res) => {

    let mobileno = req.body.mobileno;
    let carno = req.body.carno;
    let name = req.body.name;
    let parkingId = req.body.parkingId;
    user = new userModel(mobileno, carno, name);
    let emptySensorId;
    try {
        emptySensorId = await parkingModel.getEmptySlot(parkingId);
    } catch (error) {
        console.log(error);
        return res.json({
            err: true,
            msg: "something wrong happened"
        });
    }

    let uniqueId;
    try {
        uniqueId = await user.insertUserAndGetid();
        if (uniqueId === 0) {
            return res.json({
                err: true,
                msg: "unique id returned 0"
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            err: true,
            msg: "something wrong happened"
        });
    }

    try {

        result = await parkingModel.changeSensorStatus({
            parkingId: parkingId,
            sensorId: emptySensorId,
            isEmpty: 0
        });

        if (result)
            return res.json({
                success: true,
                err: false,
                msg: "slot booked successfully",
                uniqueId: uniqueId,
                slot: emptySensorId
            });
        else
            return res.json({
                err: true,
                msg: "slot not booked "
            });

    } catch (error) {
        console.log(error);
        return res.json({
            err: true,
            msg: "something wrong happened"
        });
    }
};