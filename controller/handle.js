
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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


class account{
    async login(body){
        var request = new sql.Request();
        // var mail = body.email;
        var mail = body.email.split('@');
        console.log(mail)
        var id = mail[0];
        var format = mail[1]
        var pwd = body.password;
        // var id = mail.substring(0,8);
        var acc = await request.query(`SELECT Password, Status FROM pingDB.dbo.STUDENTS WHERE SID = '${id}'`);
        // console.log(id);
        // เช็คว่าเมลที่ใส่เข้ามาเป็น format ไหน
        if(format != "cskmitl.ac.th"){
            console.log("[Login] Wrong mail format")
            var message = {
                message: "Please use cs-kmitl mail"
            }
            return[400, message] // 400: Bad Request
        }
        // เช็คว่ามี account อยู่ใน DB มั้ย
        if(acc.recordset.length == 0){
            console.log("[Login] Don't have account")
            var message = {
                message: "Don't have this account, please Sign Up"
            }
            return[400, message] // 400: Bad Request
        }
        // password ที่ใส่มาไม่ตรงกับใน DB
        if(pwd != acc.recordset[0].Password){
            console.log("[Login] Wrong password")
            var message = {
                message: "Wrong Password"
            }
            return[403, message]; // 403: client does not have access
        }
        // login เข้ามาแล้วแล้วรึยัง Status = 'Y'
        if(acc.recordset[0].Status == 'Y'){
            console.log("[Login] Login already")
            var message = {
                message: "Already Login"
            }
            return[400, message] // 400: Bad Request
        }
        // Login Update Status from 'N' to 'Y'
        await request.query(`UPDATE pingDB.dbo.STUDENTS SET Status = 'Y' WHERE SID = '${id}'`)
        console.log("[Login] Login success")
        var message = {
            message: "Login Success"
        }
        return[200, message] // 200: OK
    }

    async report(){
        const csvWriter = createCsvWriter({
            // file name
            path: 'report.csv',
            // column name
            header: [
                {id: 'login', title: 'Login'},
                {id: 'notLogin', title: 'Not Login'},
                {id: 'name', title: 'Not Login student'},
            ]
        });

        var request = new sql.Request();
        // count Status = 'Y' column name total
        var login = await request.query(`SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'Y'`);
        // count Status = 'N' column name total
        var notLogin = await request.query(`SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'N'`);
        // select not login student's name
        var name = await request.query(`SELECT Firstname FROM pingDB.dbo.STUDENTS WHERE Status = 'N'`);

        console.log(login.recordset[0]);
        console.log(notLogin.recordset[0]);
        console.log(name.recordset);

        // data each row
        const data = [
            {
                login: login.recordset[0].total,
                notLogin: notLogin.recordset[0].total,
                name: name.recordset[0].Firstname,
            },
            {
                name: name.recordset[1].Firstname
            }
        ];

        // write csv file
        csvWriter
            .writeRecords(data)
            .then(()=> console.log('[Report] The CSV file was written successfully'));

        var message = {
            message: "Create Report Success"
        }
        return[200, message]
    }



}

module.exports = account;