
const db = require("../util/db_util");
const pool = db.pool;

class Parking {

    // constructor (parkingName,parkingId,lattitude,longitude,address){
    //     this.parkingName = parkingName;
    //     this.parkingId = parkingId;
    //     this.lattitude = lattitude;
    //     this.longitude = longitude;
    //     this.address = address;
    // }
    static changeSensorStatus(parkingId, sensorId, status) {
        if (status=="True") status = 1;
        else status = 0;
        const query = "UPDATE sensors  set is_empty = ? where sensor_id = ? and parking_id = ?";
        return pool.execute(query, [status, sensorId, parkingId]);
    }

    static returnEmptyParkings() {
        const query = "select distinct parking_name from parkings p inner join sensors s where p.parking_id=s.parking_id and is_empty = True";
        return pool.execute(query);
    }

}

module.exports = Parking;
