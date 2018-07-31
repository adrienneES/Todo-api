const {mongoose} = require('./../db/mongoose');
var Todo = mongoose.model('Todo', {
    text: {
        type: String, 
        required:true, 
        minlength:3, trim: true
    },
    completed: {type: Boolean, default: false},
    completedAt: {type: Number, default:null},
    _creator : {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
});
module.exports= {Todo};
