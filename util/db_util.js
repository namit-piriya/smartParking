
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
        car_no varchar(10) unique,
        FOREIGN KEY (parking_id) REFERENCES parkings(parking_id)
        )`
    );
    await pool.execute(`
        create TABLE IF NOT EXISTS users(
            mobile_no varchar(10),
            name varchar(25),
            carno varchar(10),
            unique_id varchar(13)
        )
    `);
};

module.exports.pool = pool;

