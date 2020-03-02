
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

    static async returnEmptyParkings() {
        const query = "select distinct parking_name,latitude, longitude ,p.parking_id from parkings p inner join sensors s where p.parking_id=s.parking_id and is_empty = 1";
        const slotQuery = "select count(*) as count,parking_id from sensors where is_empty=1 group by parking_id";
        let result;
        try {
            result = await pool.execute(query);
        } catch (error) {
            throw error;
        }
        let emptySlotsArray;
        let sendResult = [];
        try {
            emptySlotsArray = await pool.execute(slotQuery);
        } catch (error) {
            throw error;
        }
        result[0].forEach(element => {
            let obj = {};
            let parkingName = element.parking_name;
            let parkingId = element.parking_id;
            let lat = element.latitude;
            let long = element.longitude;
            emptySlotsArray[0].forEach(element => {
                if (element.parking_id == parkingId) {
                    obj.parking_name = parkingName;
                    obj.slots = element.count;
                    obj.latitude = lat;
                    obj.longitude = long;
                }
            });
            sendResult.push({ ...obj });
        });

        return sendResult;
    }
    static async getEmptySlot(parkingId) {
        const query = "select distinct sensor_id from sensors where parking_id = ? and is_empty = 1 Limit 1";
        let result;
        try {
            result = await pool.execute(query, [parkingId]);

        } catch (error) {
            console.log(error);
            throw error;
        }
        return result[0][0].sensor_id;
    }
    static async getParkingId() {
        const query = "select count(*) as count from parkings";
        let result = await pool.execute(query);
        return result[0][0].count;
    }
}

module.exports = Parking;
