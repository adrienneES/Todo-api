//mongodb native
const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client)=>{
    if (err) {
        return console.log(`error: ${err}`);
    }
    var db = client.db('TodoApp')
    console.log('connected');
    var count = 0;
    // db.collection('Todos')
    // //findone and update
    // .findOneAndUpdate({text: 'second todo'},{
    //     $set: {completed:true, text: 'second is done'}
    // }, {returnOriginal:false})
    // .then((data)=>{
    //     console.log(`data: ${JSON.stringify(data, undefined, 2)}`);
    // })
    db.collection('Users')
    .findOneAndUpdate({
        name: 'tim'},{$set: {name: 'tim'}, $inc: {age: 1}}, {returnOriginal:false})
    .then((user)=>{
        console.log(`user: ${JSON.stringify(user, undefined, 2)}`);
    }).catch((err)=>console.log(err));

//    client.close();
})
