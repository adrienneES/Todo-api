const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {mongoose} = require('./../db/mongoose');
const validator = require('validator');
var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required:true,
        trim: true,
        minlength:1,
        unique: true,
        validate: {
            validator: (value)=>{
                return validator.isEmail(value);
            },
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }     
    }]
})
 UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(()=>{
        return token;
    });
}
UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token:token
            }
        }
    });
}
UserSchema.methods.toJSON = function() {
    let user = this; 
    let userObj = user.toObject();
    return _.pick(userObj, ['_id','email'])
}
UserSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        //user.password
        bcrypt.genSalt(10, (err, salt)=>{
            const pw = user.password;
            bcrypt.hash(user.password, salt,(err, hash)=>{
                user.password  = hash;
                console.log(`saving password after hash pw: ${pw}, hash ${hash}`);
                next();
            });
        });

    } else {
        next();
    }
})
UserSchema.statics.findByCredentials = function (email, password){
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject('user not found');
        }
        return new Promise((resolve, reject)=>{
            try {
                bcrypt.compare(password, user.password, (err, res)=>{
                    if (res) {
                        resolve(user);
                    } else {
                        reject('password did not validate' );
                    }
                });
                } catch (error) {
                    Promise.reject('uhoh');                 
            }
        })
    });
}
UserSchema.statics.findByToken = function( token){
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (error) {
        return Promise.reject('did not verify');
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
    })
}
var User = mongoose.model('User', UserSchema);

module.exports= {User};
