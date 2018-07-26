//mongodb native
const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client)=>{
    if (err) {
        return console.log(`error: ${err}`);
    }
    var db = client.db('TodoApp')
    console.log('connected');
    var count = 0;
    db.collection('Users')
    .deleteMany({name: 'sara'})
    .then((result)=>{
        return console.log(`deleted: ${result.result.n}`);
    })
    .then(()=>{
        db.collection('Users')
        .findOneAndDelete({_id: new ObjectID('5b59fe92e0b72f8b724f1cda')})
        .then((user)=>{
            console.log(`user: ${user}`);
        })
        .catch((err)=> {console.log(`err ${err}`);})
    })
    .catch((err)=> {
        console.log(err);
    })
    //deleteMany
    // .deleteMany({text:'first todo'})
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })
    //deleteOne
    // .deleteOne({text:'second todo'})
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })
    //findOneAndDelete
    // .findOneAndDelete({text:'second todo'})
    // .then((todo)=>{
    //     console.log(todo);
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })

//    client.close();
})
