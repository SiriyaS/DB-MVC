
var moment = require('moment');
// var date = moment().format("YYYY-MM-DD kk:mm:ss");

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
    // Deposit Money
    async deposit(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var amount = body.amount;
        var acc = await request.query(`SELECT password FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        // เช็คว่ารหัสที่ใส่เข้ามาตรงกับใน DB มั้ย
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            console.log(`[Deposit Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Wrong Password`)
            return[403, message]; // 403: client does not have access
        }
        // ใส่เงินมาน้อยกว่า 100 บาท
        if(amount < 100){
            message = {
                message: "กรุณาฝากเงิน 100 บาท ขึ้นไป"
            }
            console.log(`[Deposit Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Please deposit more than 100 baht`)
            return[400, message]; // 400: Bad Request
        }
        // ใส่จำนวนเงินที่เป็นรูปแบบเหรียญ ex.1,522 (ต้องเป็นหลักร้อยขึ้นไป)
        if(amount%100 != 0){
            message =  {
                message: "ไม่สามารถฝากเงินที่เป็นรูปแบบเหรียญได้ กรุณาใส่จำนวนเงินในรูปแบบธนบัตร 100 บาท ขึ้นไป"
            }
            console.log(`[Deposit Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Please deposit money in form of 100 baht bill or more`)
            return[400, message] // 400: Bad Request
        }
        // Update เงินใน DB อันเก่า - ที่ฝากเข้ามา
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance + ${amount}
        WHERE account_no = '${acc_no}'`);
        message = {
            message: "ฝากเงินเรียบร้อย"
        }
        console.log(`[Deposit Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Deposit Success`)
        return[200, message]; // 200: OK
    }

    async withdraw(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var amount = body.amount;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        // เช็คว่ารหัสที่ใส่เข้ามาตรงกับใน DB มั้ย
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            console.log(`[Withdraw Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Wrong Password`)
            return[403, message]; // 403: client does not have access
        }
        // ใส่เงินมาเกิน 20,000 บาท หรือ เกินจำนวนเงินในบัญชี
        if(amount > 20000 || amount > acc.recordset[0].account_balance){
            message = {
                message: "กรุณาถอนเงินไม่เกินจำนวนเงินที่คงเหลือในบัญชี หรือ ไม่เกินครั้งละ 20,000 บาท"
            }
            console.log(`[Withdraw Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Please withdraw money not more than account balance or 20,000 baht`)
            return[400, message]; // 400: Bad Request
        }
        // ใส่จำนวนเงินที่เป็นรูปแบบเหรียญ ex.1,522 (ต้องเป็นหลักร้อยขึ้นไป)
        if(amount%100 != 0){
            message =  {
                message: "ไม่สามารถถอนเงินที่เป็นรูปแบบเหรียญได้ กรุณาใส่จำนวนเงินในรูปแบบธนบัตร 100 บาท ขึ้นไป"
            }
            console.log(`[Withdraw Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Please withdraw money in form of 100 baht bill or more`)
            return[400, message]; // 400: Bad Request
        }
        // Update เงินใน DB อันเก่า - ที่ถอนไป
        await request.query(`UPDATE pingDB.dbo.Bank_account
        SET account_balance = account_balance - ${amount}
        WHERE account_no = '${acc_no}'`);
        message = {
            message: "ถอนเงินเรียบร้อย"
        }
        console.log(`[Withdraw Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Withdraw Success`)
        return[200, message]; // 200: OK
    }

    async transfer(body){
        var request = new sql.Request();
        var acc_from = body.from_account;
        var pwd = body.password;
        var acc_to = body.to_account;
        var amount = body.amount;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_from}'`)
        // เช็คว่ารหัสที่ใส่เข้ามาตรงกับใน DB มั้ย
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            console.log(`[Transfer Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Wrong Password`)
            return[403, message]; // 403: client does not have access
        }
        // ใส่เงินมาเกิน 1,000,000 บาท หรือ เกินจำนวนเงินในบัญชี
        if(amount > 1000000 || amount > acc.recordset[0].account_balance){
            message = {
                message: "กรุณาโอนเงินไม่เกินจำนวนเงินที่คงเหลือในบัญชี หรือ ไม่เกินครั้งละ 1,000,000 บาท"
            }
            console.log(`[Transfer Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Please transfer money not more than account balance or 1,000,000 baht`)
            return[400, message]; // 400: Bad Request
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
        console.log(`[Transfer Money] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Transfer Success`)
        return[200, message]; // 200: OK
    }

    async checkBalance(body){
        var request = new sql.Request();
        var acc_no = body.account_no;
        var pwd = body.password;
        var acc = await request.query(`SELECT password, account_balance FROM pingDB.dbo.Bank_account WHERE account_no = '${acc_no}'`)
        // เช็คว่ารหัสที่ใส่เข้ามาตรงกับใน DB มั้ย
        if(pwd != acc.recordset[0].password){
            var message = {
                message: "รหัสผ่านไม่ถูกต้อง"
            }
            console.log(`[Check Account Balance] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Wrong Password`)
            return[403, message]; // 403: client does not have access
        }
        message = {
            balance: acc.recordset[0].account_balance
        }
        console.log(`[Check Account Balance] ${moment().format("YYYY-MM-DD kk:mm:ss")} : Check Balance Success`)
        return[200, message]; // 200: OK
    }

}

module.exports = account;