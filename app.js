const express = require("express");
const path = require('path');
const app = express();
const mngmntcontroller = require("./controllers/parkingmanagementcontroller");
const mngmntRoute = require('./routes/mngmnt_route');
const admincontroller = require("./controllers/admincontroller");
// const morgan = require('morgan');


const {init} = require("./util/db_util");

async function initialize(){
    await init();
}

initialize();

const port = process.env.PORT || 3008;
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.post("/admin/add_parking",admincontroller.addParking);
app.post("/users/book_slot",mngmntcontroller.bookSlot);
app.use("/scp",mngmntRoute);
app.use("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"));
});

app.listen(port);
console.log(`listening on the port no ${port}.....`);
