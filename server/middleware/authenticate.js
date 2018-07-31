const {User} = require('./../../models/user');
var authenticate = ((req, res, next)=>{

    let token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject('no user');
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err)=>{
        res.status(401).send('didnt authenticate: ' + err);
    });
});
module.exports = {
    authenticate
}