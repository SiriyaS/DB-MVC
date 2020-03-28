
const express = require('express')
const app = express()
const account = require('../controller/handle');

app.get('/ping', (req,res) => {
    res.send('pong')
})


app.post('/login', async function (req,res){
    var result = await new account().login(req.body);
    res.status(result[0]).json(result[1]);
    console.log("login OK")
})

app.get('/report', async function (req,res){
    var result = await new account().report();
    res.status(result[0]).json(result[1]);
})

module.exports = app