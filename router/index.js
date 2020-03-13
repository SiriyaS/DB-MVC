const express = require('express')
const app = express()
const record = require('../controller/handle');

app.get('/ping', (req,res) => {
    res.send('pong')
})

app.post('/createProfile', async function (req,res) {
    var result = await new record().createProfile(req.body)
    console.log("Create Profile Success")
    res.status(201).json(result)  
})

// find profile by id
app.post('/findProfile', async function(req,res){
    // console.log(req.body)
    var result = await new record().findProfile(req.body.id)
    console.log("Find Profile Success")
    res.status(200).json(result)  
})

// find profile by status (show all)
app.post('/findProfile/status', async function(req,res){
    var result = await new record().findProfile_status(req.body)
    console.log("Find Profile Success")
    res.status(200).json(result)  
})

// Delete Document
app.post('/deleteProfile', async function(req,res){
    var result = await new record().deleteProfile(req.body.id)
    console.log("Delete Profile Success")
    res.status(200).json(result)  
})

// Edit Document
// app.post('/updateProfile', async function(req,res){
//     var result = await new record().updateProfile(req.body)
//     console.log("Update Profile Success")
//     res.status(200).json(result)  
// })

// Edit grade
app.post('/updateGrade', async function(req,res){
    var result = await new record().updateGrade(req.body)
    console.log("Update Grade Success")
    res.status(200).json(result)  
})

// Edit work_status
app.post('/updateStatus', async function(req,res){
    var result = await new record().updateStatus(req.body)
    console.log("Update Status Success")
    res.status(200).json(result)  
})

// app.post('/createFaculty', async function (req,res) {
//     var result = await new record().createFaculty(req.body)
//     console.log("Create Faculty Success")
//     res.status(201).json(result)  
// })


module.exports = app