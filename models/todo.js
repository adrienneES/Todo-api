const {mongoose} = require('./../db/mongoose');
var Todo = mongoose.model('Todo', {
    name: {type: String, required:true},
    completed: {type: Boolean, default: false},
    completedAt: {type: Number}
});
module.exports= {Todo};