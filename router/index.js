
const express = require('express')
const app = express()
const account = require('../controller/handle');

app.get('/ping', (req,res) => {
    res.send('pong')
})

// Student Login
app.post('/login', async function (req,res){
    var result = await new account().login(req.body);
    res.status(result[0]).json(result[1]);
})

// Get login report
app.get('/report', async function (req,res){
    var result = await new account().report();
    res.status(result[0]).json(result[1]);
})

module.exports = app