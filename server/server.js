const {mongoose} = require('./../db/mongoose');

const {Todo} = require('./../models/todo');
var todo = new Todo({name: 'learn mongoose' });
todo.save()
.then((data)=>{
    console.log(`data: ${JSON.stringify(data, undefined, 2)}`);
})
.catch((err)=> {
    console.log(`err: ${err}`)
})
