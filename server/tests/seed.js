const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const todoOneId = new ObjectID();
const todoTwoId = new ObjectID();
const todos = [{
    _id: todoOneId,
    text: 'first todo',
    _creator: userOneId
}, {
    _id: todoTwoId,
    text: 'second todo', 
    completed: true, 
    completedAt: 123, 
    _creator: userTwoId
    }
];
const users = [{
    _id: userOneId,
    email: 'adri@a.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'adri2@a.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];
const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo= new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(()=>{
        done(); 
    });
};
const populateTodos = 
(done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
}
module.exports = {
    todos, users, populateTodos,populateUsers
}