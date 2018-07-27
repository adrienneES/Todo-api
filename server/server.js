const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const PORT = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use((req, res, next)=>{
    console.log(req.url);
    next();
});
app.post('/users', (req, res)=>{
    const name = req.body.name;
    var user = new User({name});
    user.save().then((result)=>{
        res.send(result);
    })
    .catch((err)=>{res.status(400).send({msg:'uhoh', err})});
})
app.get('/users', (req, res)=>{
    User.find().then((users)=>{
        res.send({count: users.length, users});
    }).catch((err)=>res.status(400).send(`err: ${err}`))
});
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
app.delete('/users/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        console.log('invalid id');
        return res.status(400).send({msg: 'invalid id'});
    }
    User.findByIdAndRemove(id).then((user)=>{
        if (!user){
            return res.status(404).send({msg: 'not found'});
        }
        res.send({msg:'successfully deleted', user});
    }).catch((err)=>{
        console.log(`err: ${err}`);
        res.status(404).send({msg: 'not found'})})
})

app.post('/todos', (req, res)=>{
    var todo = new Todo({text: req.body.text});
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((err)=>{res.status(400).send({err})})
});
app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({count: todos.length, todos});
    }).catch((err)=>{
        res.status(400).send({err});
    })
})
app.delete('/todos/:id', (req, res)=>{
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('invalid id');
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
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
app.get('/', (req, res)=>{
    res.send('this is todo app');
})
app.listen(PORT, ()=>{
    console.log('started on port ', PORT)
});

module.exports = {app};