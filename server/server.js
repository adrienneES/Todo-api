const _ = require('lodash'); 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const {ObjectID} = require('mongodb'); 

require('./config/config'); 
const {mongoose} = require('./../db/mongoose'); 
const {Todo} = require('./../models/todo'); 
const {User} = require('./../models/user'); 
const {authenticate} = require('./middleware/authenticate'); 
const PORT = process.env.PORT; 

var app = express(); 
app.use(bodyParser.json()); 
app.use((req, res, next) =>  {
    console.log(req.url); 
    next(); 
}); 
app.get('/users/me', authenticate, (req, res) =>  {
    res.send( {user:req.user}); 
}); 

// POST /users/login {email, password}
app.post('/users/login', (req, res) =>  {
    let body = _.pick(req.body, ['email', 'password']); 
    User.findByCredentials(body.email, body.password).then((user) =>  {
        user.generateAuthToken().then((token) =>  {
            res.header('x-auth', token).send(user); 
        }); 
    }).catch((err) =>  {
        res.status(400).send(err); 
    })
}); 
app.delete('/users/me/token', authenticate, (req, res) =>  {
    req.user.removeToken(req.token).then(() =>  {
        res.status(200).send('user deleted'); 
    }).catch((err) =>  {
        res.status(400); 
    }); 
})
app.post('/users', (req, res) =>  {
    var user = new User(_.pick(req.body, ['email', 'password'])); 
    user.save().then(() =>  {
        return user.generateAuthToken(); 
    })
    .then((token) =>  {
        res.header('x-auth', token).send(user); 
    })
    .catch((err) =>  {res.status(400).send( {msg:'uhoh', err})}); 
})
app.post('/todos', authenticate, (req, res) =>  {
    var todo = new Todo( {
        text:req.body.text, 
        completed: req.body.completed,
        _creator:req.user._id
    }); 
    todo.save().then((doc) =>  {
        res.send(doc); 
    }).catch((err) =>  {res.status(400).send( {err})})
}); 
app.get('/todos', authenticate, (req, res) =>  {
    Todo.find( {
        _creator:req.user._id
    }).then((todos) =>  {
        res.send( {count:todos.length, todos}); 
    }).catch((err) =>  {
        res.status(400).send( {err}); 
    })
})
app.get('/todos/:id', authenticate, (req, res) =>  {
    const id = req.params.id; 
    if ( ! ObjectID.isValid(id)) {
        return res.status(404).send('bad id')
    }
    Todo.findOne( {
        _id:id, 
    _creator:req.user._id}).then((todo) =>  {
        if ( ! todo) {
            return res.status(404).send('not found'); 
        }
        res.send( {todo}); 
    })
})
app.delete('/todos/:id', authenticate, (req, res) =>  {
    const id = req.params.id; 
    if ( ! ObjectID.isValid(id)) {
        return res.status(400).send('invalid id'); 
    }
    Todo.findOneAndRemove( {
        _id:id, 
        _creator:req.user._id
    }).then((todo) =>  {
        if ( ! todo) {
            return res.status(404).send(); 
        }
        res.send( {todo}); 
    }).catch((e) =>  {
        res.status(400).send(); 
    })
})

app.patch('/todos/:id', authenticate, (req, res) =>  {
    const id = req.params.id; 
    var body = _.pick(req.body, ["text", "completed"]); 
    if ( ! ObjectID.isValid(id)) {
        return res.status(400).send( {msg:'bad id'}); 
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); 
    }else {
        body.completedAt = null; 
        body.complete = false; 
    }
    Todo.findOneAndUpdate( {
        _id:id, _creator:req.user._id},  {$set:body},  {new:true})
        .then((todo) =>  {
        if ( ! todo) {return res.status(404).send( {msg:'not found'})}
        res.send( {msg:'updated', todo}); 
    }).catch((err) =>  {
        res.status(400).send( {msg:`err:$ {err}`})
    })
})

app.get('/', (req, res) =>  {
    res.send('this is todo app'); 
}); 


app.listen(PORT, () =>  {
    console.log('started on port ', PORT)
}); 

module.exports =  {app}; 