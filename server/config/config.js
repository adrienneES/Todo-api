var env = process.env.NODE_ENV || 'development';

console.log(`***** ${env} *****`)

// loads env vars PORT, JWT_SECRET & MONGODB_URI from file 
//      that is not up on git
if(env === 'development' || env === 'test') {
    let config = require('./config.json');
    let envConfig = config[env];
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    })
}
