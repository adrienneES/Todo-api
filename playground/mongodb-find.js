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
        .find({name:'adri'}).count().then((count)=>{
            console.log(count);
        })
    // db.collection('Todos')
    //     .find({completed:false}).forEach((todo)=>{
    //         console.log(`todo# ${count++}: ${JSON.stringify(todo, undefined, 2)}`);
    //     })
    //     .catch((err)=>{
    //         console.log(`couldn't fect ${err}`)
    //     })
    // db.collection('Todos')
    //     .find({completed:false}).toArray().then((docs)=>{
    //         console.log(JSON.stringify(docs, undefined, 2));
    //         return console.log(`num found: ${docs.length}`)
    //     })
    //     .then(()=>{
    //         db.collection('Todos')
    //             .find({_id: new ObjectID('5b59ea4c46ae125c0c172bf7')})
    //             .toArray().then((docs)=>{
    //                 console.log(docs);
    //             })
    //     })
    //     .catch((err)=>{
    //         console.log(`couldn't fect ${err}`)
    //     })
//    client.close();
})
