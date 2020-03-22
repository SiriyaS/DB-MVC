const express = require('express')
const app = express()
const record = require('../controller/handle');

app.get('/ping', (req,res) => {
    res.send('pong')
})

// 1. create profile
app.post('/createProfile', async function (req,res) {
    var result = await new record().createProfile(req.body)
    console.log("Create Profile Success")
    res.status(201).json(result)  
})

// 2.find profile by id
app.post('/findProfile', async function(req,res){
    // console.log(req.body)
    var result = await new record().findProfile(req.body.id)
    console.log("Find Profile Success")
    res.status(result[0]).json(result[1])
})

// 3.find profile by student_status = 'Y' 0 = show all
app.post('/findProfile/status', async function(req,res){
    console.log(req.query.faculty)
    var result = await new record().findProfile_status(req.query.faculty)
    console.log("Find Profile Success")
    res.status(result[0]).json(result[1])
})

// Delete Document
// app.post('/deleteProfile', async function(req,res){
//     var result = await new record().deleteProfile(req.body.id)
//     console.log("Delete Profile Success")
//     res.status(200).json(result)
// })

// 4.Update grade
app.post('/updateGrade', async function(req,res){
    var result = await new record().updateGrade(req.body)
    console.log("Update Grade Success")
    res.status(200).json(result)  
})

// 5.Delete profile Update work_status
app.post('/updateStatus', async function(req,res){
    var result = await new record().updateStatus(req.body)
    console.log("Update Work_Status Success")
    res.status(200).json(result)  
})

// app.post('/createFaculty', async function (req,res) {
//     var result = await new record().createFaculty(req.body)
//     console.log("Create Faculty Success")
//     res.status(201).json(result)  
// })


module.exports = app