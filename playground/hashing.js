const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'abc123';

// bcrypt.genSalt(10, (err, salt)=>{
//     bcrypt.hash(password, salt,(err, hash)=>{
//         console.log(`hash: ${hash}`);
//     });
// });
var hashedPw = '$2a$10$qvaMBK3ncpe9m6WiHF74m.FlgDGfoid2xG9Bh01YqwGUI/w9Qekra';

bcrypt.compare(password, hashedPw, (err, result)=>{
    if (result) {
        console.log('same');
    } else {
        console.log('not');
    }
})

// var data = {id:10}

// var token = jwt.sign(data, 'abc123');
// console.log(token);
// try {
//     var decoded = jwt.verify(token, 'abc123');
//     console.log(`decoded ${JSON.stringify(decoded, undefined, 2)}`)
//     } catch (error) {
//     console.log(error);
// }
// var message = 'hi there';
// var hash = SHA256(message).toString();

// console.log(`message: ${message}, hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data, 
//     hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// //token.data.id = 6;
// //token.hash = SHA256(JSON.stringify(token.data)).toString();
// var result = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(result == token.hash) {
//     console.log('data not changed');
// } else {
//     console.log('data changed!!!');
// }
