const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');

Todo.findByIdAndRemove('5b5a38914d807505ac35e51a').then((todo)=>{
    console.log(todo);
});