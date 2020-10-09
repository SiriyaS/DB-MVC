const data = require('../model/input.json');
const fs = require('fs');

class dataClean{
    hello(){
        console.log("how are you");
        return "Hi!"
    }

    async cleaning(body){
        // เอาที่ input เข้ามาไปใส่ใน json file
        var input = {
            "input_string": body.message
        };
        const jsonString = JSON.stringify(input);
        console.log(jsonString);
        await fs.writeFile('./model/input.json', jsonString, function (err) {
            if (err) throw err;
            console.log('JSON File Replaced!');
        });

        var inputStr = data.input_string;
        // 1.รับข้อความอันมีความยาวไม่ต่ํากว่า 20 ตัวอักษร และไม่มากกว่า 255 ตัวอักษร (นับช่องว่าง)
        if(inputStr.length < 20 || inputStr.length > 255){
            var error = {
                "status": 400,
                "error": "ข้อความต้องมีความยาวระหว่าง 20 ถึง 255 ตัวอักษร"
            };
            return [400,error]
        }

        // 2.ข้อความต้องผ่านกระบวนการทําความสะอาดข้อมูล หรือ Data Cleansing ก่อน ด้วยการแปลงให้ตัวอักษรพิมพ์ใหญ่ภายในข้อความให้เป็นตัวอักษรพิมพ์เล็กทั้งหมด
        var inputLower = inputStr.toLowerCase();

        // 3. ทําความสะอาดข้อความเพิ่มเติมด้วยการนําเครื่องหมาย “?” “!” “,” ออกจากข้อความ
        var inputClean = inputLower.split('?').join('');
        inputClean = inputClean.split('!').join('');
        inputClean = inputClean.split(',').join('');

        // 4. ตัดข้อความโดยใช้ “ “ (ช่องว่าง หรือ Whitespace) ภายในข้อความ
        var inputSplit = inputClean.split(" ");
        console.log(inputSplit);

        // 5.แสดงผลในลักษณะของตารางแจกแจงความถี่ของคําแต่ละคําในข้อความออกมา (ต้องการเพียงแค่คําแต่ละคํามีความถี่เป็นเท่าใด)
        let wordFreq = new Map();
        for(var word of inputSplit){
            if(wordFreq.has(word)){
                wordFreq.set(word,wordFreq.get(word)+1)
            }
            else{
                wordFreq.set(word, 1)
            }
        }
        console.log(wordFreq);
        let result = [];
        wordFreq.forEach((values,keys)=>{
            var freq = {
                "word": keys,
                "frequency": values
            };
            result.push(freq);
        });
        const outputString = JSON.stringify(result);
        await fs.writeFile('./model/output.json', outputString, function (err) {
            if (err) throw err;
            console.log('JSON File Created!');
        });
        return [200,result]
    }
}

module.exports = dataClean;