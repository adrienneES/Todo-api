//mongodb native
const {MongoClient} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client)=>{
    if (err) {
        return console.log(`error: ${err}`);
    }
    var db = client.db('TodoApp')
    console.log('connected');
    db.collection('Todos')
        .insertOne({text: 'first todo', completed: false}, (err, result)=> {
            if (err) {
                return console.log(`error: ${err}`)
            }
            console.log(result.ops);
        });
    client.close();
});