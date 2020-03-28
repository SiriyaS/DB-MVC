# DB-MVC

### MVC2803-2

### Database : MS SQL Server
## Create table
สร้างตารางเก็บข้อมูล account ของนักศึกษาแต่ละคนชื่อ STUDENTS
โดยมี field ชื่อ SID, Password, Firstname, Lastname, Status ซึ่ง SID เป็น Primary Key

```
CREATE TABLE pingDB.dbo.STUDENTS (
	SID varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Password varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Firstname varchar(30) COLLATE Thai_100_CS_AS NULL,
	Lastname varchar(30) COLLATE Thai_100_CS_AS NULL,
	Status char(1) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__STUDENTS__CA19597004D57A70 PRIMARY KEY (SID)
) GO
```
## Insert data
```
INSERT INTO pingDB.dbo.STUDENTS (SID, Password, Firstname, Lastname, Status)
VALUES (62050001, '12345678', 'Alien', 'Mars', 'N')
```

## Implement Code
./controller/handle.js
#### - Install dependencies
 - mssql - for connect to database
 - csv-writer - for write .csv file
```
$ npm install mssql
$ npm i -s csv-writer
```
#### - Require Library
```
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var sql = require("mssql");
```
#### - Config and Connect DB 
#### - Logic
***function login*** ส่ง email and password มาใน body เมื่อมี account อยู่ใน DB และ email and password ถูกต้องก็ให้ Update Status เป็น 'Y'

> เงื่อนไขที่ตั้งเช็คไว้ :
>
> email เป็น cskmitl.ac.th รึเปล่า
>
> มี account อยู่ใน DB รึเปล่า
>
> password ที่ใส่เข้ามา ตรงกับ password ใน DB รึเปล่า
>
> ได้ log in เข้ามาแล้วรึเปล่า

 - Update Status จาก 'N' เป็น 'Y'
```
UPDATE pingDB.dbo.STUDENTS SET Status = 'Y' WHERE SID = '${id}'
```

***function report*** ไม่ต้องส่ง parameter อะไรเข้ามา
เขียน report ออกมาเป็นไฟล์ .csv โดยในรายงานแสดง จำนวนนักศึกษาที่ log in ไม่ได้ log in และรายชื่อนักศึกษาที่ไม่ได้ log in 
 - จำนวนนักศึกษาที่ log in และ ไม่ได้ log in หาได้จาก
```
SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'Y'

SELECT COUNT(Status) as total FROM pingDB.dbo.STUDENTS WHERE Status = 'N'
```
 - รายชื่อนักศึกษาที่ไม่ได้ log in เข้ามา หาได้จาก
 ```
 SELECT Firstname FROM pingDB.dbo.STUDENTS WHERE Status = 'N'
 ```
  - write .csv file (data คือ ข้อมูลที่เราจะใส่ไปในแต่ละ field)
 ```
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
const data = [
    {
        login: จำนวนนักศึกษาที่ log in,
        notLogin: จำนวนนักศึกษาที่ไม่ได้ log in,
        name: ชื่อนักศึกษาที่ไม่ได้ log in,
    }
]
// write csv file
 csvWriter
    .writeRecords(data)
    .then(()=> console.log('[Report] The CSV file was written successfully'));
 ```
