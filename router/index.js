const express = require('express')
const app = express()
const dataClean = require('../controller/handle');

app.get('/ping', function (req,res){
    res.send("ping-ping-pong")
})

app.post('/wordfreq', async function (req, res) {
    var result = await new dataClean().cleaning(req.body);
    res.status(result[0]).json(result[1]);
})


module.exports = app