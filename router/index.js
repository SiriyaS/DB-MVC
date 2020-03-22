
const express = require('express')
const app = express()
const account = require('../controller/handle');

app.get('/ping', (req,res) => {
    res.send('pong')
})

app.post('/deposit', async function (req,res){
    var result = await new account().deposit(req.body)
    console.log("Deposit Success")
    res.status(result[0]).json(result[1]);
})

app.post('/withdraw', async function (req,res){
    var result = await new account().withdraw(req.body)
    console.log("Withdraw Success")
    res.status(result[0]).json(result[1]);
})

app.post('/transfer', async function (req,res){
    var result = await new account().transfer(req.body)
    console.log("Transfer Success")
    res.status(result[0]).json(result[1]);
})

app.post('/checkBalance', async function (req,res){
    var result = await new account().checkBalance(req.body)
    console.log("Check Balance Success")
    res.status(result[0]).json(result[1]);
})


module.exports = app