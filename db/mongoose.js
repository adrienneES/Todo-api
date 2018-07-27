const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp';
mongoose.connect(connectionString, {useNewUrlParser:true});
module.exports = {mongoose};