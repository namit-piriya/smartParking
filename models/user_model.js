const { pool } = require("../util/db_util");

class User {

    constructor(mobileno, carno, name) {
        this.carno = carno;
        this.name = name;
        this.mobileno = mobileno;
    }
    async insertUserAndGetid() {
        let carno = this.carno;
        let name = this.name;
        let mobileno = this.mobileno;
        // const query = ;
        let uniqueId;
        try {
            let countOfUsers = await User.countUsers();
            countOfUsers+=1;
            uniqueId = "SCP" + countOfUsers.toString();
        } catch (error) {
            throw error;
        }

        let result;
        try {
            result = await pool.execute("insert into users(carno,mobile_no,name,unique_id) values(?,?,?,?);", [carno, mobileno, name, uniqueId]);

            if (result[0].affectedRows == 1) {
                return uniqueId;
            }
            else return 0;

        } catch (error) {
            throw error;
        }

    }
    static async countUsers() {
        const query = "select count(*) as count from users";
        let result = await pool.execute(query);
        console.log(result, "from countUsers");
        return result[0][0].count;
    }
}
module.exports = User;