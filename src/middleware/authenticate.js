const auth = require('basic-auth');
const User = require('../models/users').User;

function userAuthentication(req, res, next){
  const credentials = auth(req);
  
  if(req.session && req.session.userId){
    next();
  }else if(credentials){
    User.authenticate(credentials.name, credentials.pass, function (error, user) {
         if(error || !user){
           const err = new Error('Wrong Email or Password');
           err.status = 401;
           return next(err);
         }else{
           req.session.userId = user._id;
           return next();
         }
       });
  }else{
        let err = new Error('Access Denied');
        err.status = 401;
        return next(err);
  }
}

module.exports.userAuthentication = userAuthentication;
