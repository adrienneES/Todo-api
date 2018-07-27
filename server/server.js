const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const PORT = 3000;

var app = express();
app.use(bodyParser.json());

app.get('/users', (req, res)=>{
    User.find().then((users)=>{
        res.send({users});
    }).catch((err)=>res.status(400).send(`err: ${err}`))
});

app.post('/users', (req, res)=>{
    const name = req.body.name;
    var user = new User({name});
    user.save().then((result)=>{
        res.send(result);
    });
})
app.get('/users/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('bad id');
    }
    User.findById(id).then((user)=>{
        if (!user) {
            return res.status(404).send('user not found');
        }
        res.send({user});
    })
});

app.post('/todos', (req, res)=>{
    var todo = new Todo({text: req.body.text});
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((err)=>{res.status(400).send({err})})
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send({err});
    })
})

app.get('/todos/:id', (req, res)=> {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('bad id')
    }
    Todo.findById(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send('not found');
        }
        res.send({todo});
    })
})
app.listen(PORT, ()=>{
    console.log('started on port ', PORT)
});

module.exports = {app};