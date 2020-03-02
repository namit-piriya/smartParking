
const mysql = require("mysql2");
const db = require("../util/db_util");
const pool = db.pool;

class Parking {

    constructor(parkingName, sensors, lattitude, longitude, address) {
        this.parkingName = parkingName;
        this.sensors = sensors;
        // this.parkingId = parkingId;
        this.latitude = lattitude;
        this.longitude = longitude;
        this.address = address;
    }

    async addParking() {
        let parkingId = await Parking.getParkingId();
        parkingId += 1;
        let arr = [];
        this.sensors.forEach(element => {
            let minarr = [];
            minarr.push(element);
            minarr.push(parkingId);
            minarr.push(1);
            arr.push([...minarr]);
        });
        console.log(arr);
        const insparkingQuery = "insert into parkings (parking_name,parking_id,latitude,longitude,address) values(?,?,?,?,?)";
        const insertQuery = "insert into sensors (sensor_id,parking_id,is_empty) values (?,?,?)";
        try {
            await pool.execute(insparkingQuery, [this.parkingName, parkingId, this.latitude, this.longitude, this.address]);
        } catch (error) {
            throw error;
        }
        arr.forEach(async (element) => {
            try {
                let result = await pool.execute(insertQuery, [element[0], element[1], element[2]]);
            } catch (error) {
                throw error;
            }
        });
    }
    static async changeSensorStatus(obj) {
        let parkingId = obj.parkingId;
        let sensorId = obj.sensorId;
        let isEmpty = obj.isEmpty;
        var query = `UPDATE sensors set is_empty = ? where sensor_id = ? and parking_id = ?;`;

        let result;
        try {
            // console.log(typeof (query));
            result = await pool.execute(query, [isEmpty, sensorId, parkingId]);
            // console.log(result, "is the result");
            if (result[0].affectedRows == 1) {
                return true;
            }
            else return false;
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }

    // static async emptyParkingwithSlot(parkings){
    //     parkings.
    // }
    static async returnEmptyParkings() {
        const query = `select distinct parking_name,latitude, longitude ,p.parking_id, s.sensor_id from parkings p inner join sensors s where p.parking_id=s.parking_id and is_empty = 1`;
        // const slotQuery = "select count(*) as count,parking_id from sensors where is_empty=1 group by parking_id";
        const slotidquery = "select sensor_id from sensors where parking_id = ? and is_empty =1";
        let parkingInfo;
        try {
            parkingInfo = await pool.execute(query);
        } catch (error) {
            throw error;
        }

        let mapOfslots = new Map();

        parkingInfo[0].forEach(element => {

            console.log(element);
            if (!mapOfslots.has(element.parking_id)) {
                mapOfslots.set(element.parking_id,{
                    sensorId: [element.sensor_id],
                    parkingName: element.parking_name,
                    latitude: element.latitude,
                    longitude: element.longitude
                });
            }
            else {
                mapOfslots.get(element.parking_id).sensorId.push(element.sensor_id);
            }
        });
        let parkingids = mapOfslots.keys();
        let sendResult = [];
        // console.log(parkingids);
        for (let [key, value] of mapOfslots) {
            sendResult.push(value);
          }
        // let sendResult = [];
        // parkingids.forEach(parkingid=>{
        //     sendResult.push(mapOfslots.get(parkingid));
        // });
        console.log(sendResult);
        return sendResult;
        // console.log(parkingInfo);
        // let emptySlotsArray = [];
        // let sendResult = [];
        // await parkingInfo[0].forEach(async element => {
        //     let obj = {};
        //     obj.parkingName = element.parking_name;
        //     let parkingId = element.parking_id;
        //     obj.latitude = element.latitude;
        //     obj.longitude = element.longitude;
        //     let result = await pool.execute(slotidquery,[parkingId]);
        //     // obj.parkingName = parkingName;
        //     let sensorsArray = [];
        //     result[0].forEach(element=>{
        //         sensorsArray.push(element.sensor_id);
        //     });
        //     obj.emptySensors = sensorsArray;
        //     console.log(obj);
        //     sendResult.push({ ...obj });
        // });
        // console.log(sendResult,"is sendResult");
        // return sendResult;
    }
    // static async getEmptySlot(parkingId) {
    //     const query = "select distinct sensor_id from sensors where parking_id = ? and is_empty = 1 Limit 1";
    //     let result;
    //     try {
    //         result = await pool.execute(query, [parkingId]);

    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    //     return result[0][0].sensor_id;
    // }
    static async getParkingId() {
        const query = "select count(*) as count from parkings";
        let result = await pool.execute(query);
        return result[0][0].count;
    }
}

module.exports = Parking;
