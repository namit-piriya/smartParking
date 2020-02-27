const express = require("express");
const path = require('path');
const app = express();

const mngmntRoute = require('./routes/mngmnt');
// const morgan = require('morgan');

// const db = require("./util/db_util");

const port = process.env.PORT || 3008;
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded());
app.use(express.json());
app.use("/scp",mngmntRoute);
app.use("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"));
});

// console.log("waiting for connection to the db.......");

app.listen(port);
console.log(`listening on the port no ${port}.....`);
