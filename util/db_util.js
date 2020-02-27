
const mysql = require('mysql2');
let pool = mysql.createPool({
    host:'127.0.0.1',
    user : 'tnp',
    password:'password',
    database:'smart_car_parking'
});

pool = pool.promise();

module.exports.init = async function initialize() {

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS parkings(
        parking_name varchar(128),
        parking_id varchar(12) primary key ,
        latitude  DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        address varchar(128)
        )
    `);
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS sensors(
        parking_id varchar(12),
        sensor_id varchar(12) primary key ,
        is_empty Boolean,
        FOREIGN KEY (parking_id) REFERENCES parkings(parking_id)
        )`
    );
};

module.exports.pool = pool;

