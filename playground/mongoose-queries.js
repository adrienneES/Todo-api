const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
// const id = '511b5a270e24676c6514299dc9';
// if(!ObjectID.isValid(id)){
//     console.log('id not valid');
// }
// Todo.find({id_:id})
// .then((todos)=>{
//     console.log(`todos: ${todos}`);
// }).catch((err)=>{console.log(err);});

// Todo.findOne({_id: id})
// .then((todo)=>{
//     console.log(`todo: ${todo}`);
// }).catch((err)=>console.log(err));
// Todo.findById(id).then((todo)=>{
//     if(!todo) {
//         return console.log(`id not found`);
//     }
//     console.log(`todo by id: ${todo}`);
// }).catch((err)=>console.log(err));
// user.findbyID
const id = '5b5a2d402b60f773682a06f7'
//user.findbyid
// handle good id, not found, bad id
if (!ObjectID.isValid(id)) {
    return console.log('bad objectid');
}
User.findById(id).then((user)=>{
    if (!user) {
        return console.log('user not found');
    }
    console.log(user);
}).catch((err)=>console.log(err));