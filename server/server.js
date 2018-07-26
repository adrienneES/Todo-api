const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const PORT = 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({text: req.body.text});
    todo.save()
    .then((doc)=>{
        res.send(doc);
    }).catch((err)=>{res.status(400).send({err})})
});

app.listen(PORT, ()=>{
    console.log('started on port ', PORT)
});

module.exports = {app};