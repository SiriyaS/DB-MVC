
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
        var mail = body.email;
        var pwd = body.password;
        var id = mail.substring(0,8);
        var acc = await request.query(`SELECT Password, Status FROM pingDB.dbo.STUDENTS WHERE SID = '${id}'`);
        // console.log(id);
        if(acc.recordset.length == 0){
            var message = {
                message: "Don't have this account, please Sign Up"
            }
            return[400, message] // 400: Bad Request
        }
        if(pwd != acc.recordset[0].Password){
            var message = {
                message: "Wrong Password"
            }
            return[403, message]; // 403: client does not have access
        }
        if(acc.recordset[0].Status == 'Y'){
            var message = {
                message: "Already Login"
            }
            return[400, message]
        }
        await request.query(`UPDATE pingDB.dbo.STUDENTS SET Status = 'Y' WHERE SID = '${id}'`)
        var message = {
            message: "Login Success"
        }
        return[200, message]
    }

    async report(){
        const csvWriter = createCsvWriter({
            path: 'report.csv',
            header: [
                {id: 'login', title: 'Login'},
                {id: 'notLogin', title: 'Not Login'},
                {id: 'name', title: 'Not Login student'},
            ]
        });

        var request = new sql.Request();
        var login = await request.query(`SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'Y'`);
        var notLogin = await request.query(`SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'N'`);
        var name = await request.query(`SELECT Firstname FROM pingDB.dbo.STUDENTS WHERE Status = 'N'`);

        console.log(login.recordset[0]);
        console.log(notLogin.recordset[0]);
        console.log(name.recordset);
        // var write = '';
        // var data = '';
        // for(var i in name.recordset.length){
        //     data = [
        //         {
        //             login: login.recordset[0].total,
        //             notLogin: notLogin.recordset[0].total,
        //             name: name.recordset[i].Firstname
        //         }
        //     ];
        //     // write = write + data;
        // }

        // const toCSV = [
        //     write
        // ];
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

        csvWriter
            .writeRecords(data)
            .then(()=> console.log('The CSV file was written successfully'));

        var message = {
            message: "Create Report Success"
        }
        return[200, message]
    }



}

module.exports = account;