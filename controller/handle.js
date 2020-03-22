const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin_user:wecode1234@wecode-o32ec.gcp.mongodb.net/RECORD?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

var moment = require('moment');

var sql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: 'P@d0rU123',
    server: '167.71.200.91',
    database: 'pingDB',
    // "options": {
    //     "encrypt": true,
    //     "enableArithAbort": true
    //     },
};

// connect to your database
var err = sql.connect(config)
if (err) console.log(err);


class record{
    // --------------------------------------------------- MS SQL ----------------------------------------------------------------------------------------
    // 1.Create student
    async createProfile(body){
        var first_name = body.first_name;
        var last_name = body.last_name;
        var faculty_id = body.faculty_id;
        var gender = body.gender;
        var admission_date = moment().format("YYYY-MM-DD kk:mm:ss");
        var grade = body.grade;
        var student_status = body.student_status;
        var create_by = body.create_by;
        var create_date = moment().format("YYYY-MM-DD kk:mm:ss");
        var update_by = body.update_by;
        var update_date = moment().format("YYYY-MM-DD kk:mm:ss");
        var work_status = body.work_status;
        
        var request = new sql.Request();
        await request.query(`INSERT INTO pingDB.dbo.STUDENT_PROFILE (first_name, last_name, faculty_id,
                 gender, admission_date, grade, student_status, create_by, create_date,
                 update_by, update_date, work_status)
                 VALUES ('${first_name}', '${last_name}', ${faculty_id}, '${gender}', '${admission_date}',
                 ${grade}, '${student_status}', '${create_by}', '${create_date}', '${update_by}', '${update_date}', '${work_status}')`);
        var message = {
            message: "Create Profile Success"
        }
        return message;
    }

    // 2.Get student by id
    async findProfile(id){
        var request = new sql.Request();
        var data = await request.query(`SELECT id, first_name, last_name, faculty_id,
                             gender, admission_date, grade, student_status, create_by, create_date,
                             update_by, update_date, work_status
                             FROM pingDB.dbo.STUDENT_PROFILE
                             WHERE id = ${id}`);
        if(data.recordset.length == 0){
            var message = {
                message: "No student Found"
            }
            return[404, message]
        }
        return [200, data.recordset];
    }

    // 3. Get student by student_status = Y 0 = show all
    async findProfile_status(faculty){
        var request = new sql.Request();
        if(faculty == "All") var faculty_id = 0;
        else{
            var id = await request.query(`SELECT id FROM pingDB.dbo.FACULTY WHERE name = '${faculty}'`);
            faculty_id = id.recordset[0].id;
        }
        console.log(faculty_id)
        if(faculty_id == 0){
            var command = `SELECT id, first_name, last_name, faculty_id,
                             gender, admission_date, grade, student_status, create_by, create_date,
                             update_by, update_date, work_status
                             FROM pingDB.dbo.STUDENT_PROFILE
                             WHERE student_status = 'Y'`;
        }
        else{
            command = `SELECT id, first_name, last_name, faculty_id,
                             gender, admission_date, grade, student_status, create_by, create_date,
                             update_by, update_date, work_status
                             FROM pingDB.dbo.STUDENT_PROFILE
                             WHERE student_status = 'Y' AND faculty_id = ${faculty_id}`;
        }
        var data = await request.query(command);
        if(data.recordset.length == 0){
            var message = {
                message: "No student Found"
            }
            return[404, message]
        }
        return [200,data.recordset];
    }

    // 4. Update grade by id
    async updateGrade(body){
        var id = body.id;
        var grade = body.grade;
        var update_by = body.update_by;
        var update_date = moment().format("YYYY-MM-DD kk:mm:ss");
        var request = new sql.Request();
        await request.query(`UPDATE pingDB.dbo.STUDENT_PROFILE
                 SET grade = ${grade}, update_by = '${update_by}', update_date = '${update_date}'
                 WHERE id = ${id}`);
        var message = {
            message: "Update Grade Success"
        }
        return message;
    }

    // 5. Delete Profile Update work_status
    async updateStatus(body){
        var id = body.id;
        var update_by = body.update_by;
        var update_date = moment().format("YYYY-MM-DD kk:mm:ss");
        var request = new sql.Request();
        await request.query(`UPDATE pingDB.dbo.STUDENT_PROFILE
                 SET update_by = '${update_by}', update_date = '${update_date}', work_status = 'N'
                 WHERE id = ${id}`);
        var message = {
            message: "Delete Profile Update Work_status Success"
        }
        return message;
    }

    // delete by id
    // async deleteProfile(id){
    //     await request.query(`DELETE FROM pingDB.dbo.STUDENT_PROFILE
    //                         WHERE is = ${id}`);
    //     var message = {
    //         message: "Delete Profile Success"
    //     }
    //     return message;
    // }

    // --------------------------------------------------- MongoDB ----------------------------------------------------------------------------------------
    // 1.Create student
    // async createProfile(body){
    //     client.connect(err => {
    //         const collection = client.db("RECORD").collection("STUDENT_PROFILE");

    //         var id = body.id;
    //         var first_name = body.first_name;
    //         var last_name = body.last_name;
    //         var faculty_id = body.faculty_id;
    //         var gender = body.gender;
    //         var dmission_date = moment().format("YYYY-MM-DD kk:mm:ss");
    //         var grade = body.grade;
    //         var student_status = body.student_status;
    //         var create_by = body.create_by;
    //         var create_date = moment().format("YYYY-MM-DD kk:mm:ss");
    //         var update_by = body.update_by;
    //         var update_date = moment().format("YYYY-MM-DD kk:mm:ss");
    //         var work_status = body.work_status;
       
    //         collection.insertOne ({ _id: id, first_name: first_name, last_name: last_name, faculty_id: faculty_id, gender: gender,
    //                                 dmission_date: dmission_date, grade: grade, student_status: student_status, create_by: create_by,
    //                                 create_date: create_date, update_by: update_by, update_date: update_date, work_status: work_status})
    //         client.close();
    //     });
    //     var message = {
    //         message: "Create Profile Success"
    //     }
    //     return message;
    // }

    // // 2. Get student by id
    // async findProfile(id) {
    //     await client.connect();
    //     const collection = await client.db("RECORD").collection("STUDENT_PROFILE");
    //     data = await  collection.findOne({ _id: id });
    //     await client.close();
    //     return data ;
    // }

    // // 3.Get student 'status = Y'
    // async findProfile_status(body){
    //     await client.connect();
    //     const collection = await client.db("RECORD").collection("STUDENT_PROFILE");
    //     // find แล้วก็เอามารวมเป็นอาเรย์ก้อนเดียว
    //     data = await  collection.find({ student_status: body.status }).toArray();
    //     await client.close();
    //     return data ;
    // }

    // async deleteProfile(id) {
    //     client.connect(err => {
    //         const collection = client.db("RECORD").collection("STUDENT_PROFILE");

    //         collection.deleteOne ({ _id: id})
    //         client.close();
    //     });
    //     var message = {
    //         message: "Delete Profile Success"
    //     }
    //     return message;
    // }

    // async updateProfile(body) {
    //     client.connect(err => {
    //         const collection = client.db("RECORD").collection("STUDENT_PROFILE");

    //         var update_date = moment().format("YYYY-MM-DD kk:mm:ss")
    //         // update grade
    //         var newValue = { $set: { grade: body.grade, 
    //                         update_by: body.update_by, update_date: update_date} };

    //         collection.updateOne ({ _id: body.id},newValue)
    //         client.close();
    //     });
    //     var message = {
    //         message: "Update Profile Success"
    //     }
    //     return message;
    // }

    // async createFaculty(body){
    //     client.connect(err => {
    //         const collection = client.db("RECORD").collection("FACULTY");
    //         var id = body.id;
    //         var name = body.name;
    //         collection.insertOne({_id: id, name: name})
    //         client.close();
    //     })
    //     var message = {
    //         message: "Create Faculty Success"
    //     }
    //     return message;
    // }


}

module.exports = record;