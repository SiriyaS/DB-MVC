// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin_user:wecode1234@wecode-o32ec.gcp.mongodb.net/RECORD?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
//
// var moment = require('moment');

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
    async deposit(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var amount = body.amount;
        var acc = await request.query(`SELECT password FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            return[403, message];
        }
        if(amount < 100){
            message = {
                message: "กรุณาฝากเงิน 100 บาท ขึ้นไป"
            }
            return[400, message];
        }
        if(amount%100 != 0){
            message =  {
                message: "ไม่สามารถฝากเงินที่เป็นรูปแบบเหรียญได้ กรุณใส่จำนวนเงินในรูปแบบธนบัตร 100 บาท ขึ้นไป"
            }
            return[400, message]
        }
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance + ${amount}
        WHERE account_no = '${acc_no}'`);
        message = {
            message: "ฝากเงินเรียบร้อย"
        }
        return[200, message]
    }

    async withdraw(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var amount = body.amount;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            return[403, message];
        }
        if(amount > 20000 || amount > acc.recordset[0].account_balance){
            message = {
                message: "กรุณาถอนเงินไม่เกินจำนวนเงินที่คงเหลือในบัญชี หรือ ไม่เกินครั้งละ 20,000 บาท"
            }
            return[400, message];
        }
        if(amount%100 != 0){
            message =  {
                message: "ไม่สามารถถอนเงินที่เป็นรูปแบบเหรียญได้ กรุณใส่จำนวนเงินในรูปแบบธนบัตร 100 บาท ขึ้นไป"
            }
            return[400, message]
        }
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance - ${amount}
        WHERE account_no = '${acc_no}'`);
        message = {
            message: "ถอนเงินเรียบร้อย"
        }
        return[200, message]
    }

    async transfer(body){
        var request = new sql.Request();
        var acc_from = body.from_account;
        var pwd = body.password;
        var acc_to = body.to_account;
        var amount = body.amount;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_from}'`)
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            return[403, message];
        }
        if(amount > 1000000 || amount > acc.recordset[0].account_balance){
            message = {
                message: "กรุณาโอนเงินไม่เกินจำนวนเงินที่คงเหลือในบัญชี หรือ ไม่เกินครั้งละ 1,000,000 บาท"
            }
            return[400, message];
        }
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance - ${amount}
        WHERE account_no = '${acc_from}'`);
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance + ${amount}
        WHERE account_no = '${acc_to}'`);
        message = {
            message: "โอนเงินเรียบร้อย"
        }
        return[200, message]
    }

    async checkBalance(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        // console.log(acc);
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            return[403, message];
        }
        message = {
            balance: acc.recordset[0].account_balance
        }

        return[200, message]
    }

}

module.exports = account;