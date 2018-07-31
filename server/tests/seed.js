const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const todos = [{
    text: 'first todo', _id: new ObjectID()},
    {text: 'second todo', completed: true, completedAt: 123, _id: new ObjectID()}];
    const userOneId = new ObjectID();
    const userTwoId = new ObjectID();
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
    password: 'userTwoPass'
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