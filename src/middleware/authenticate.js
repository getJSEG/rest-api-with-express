const User = require('../models/users').User;

function userAuthentication(req, res, next){

  if(req.session && req.session.userId){
    next();
  }else if(req.body.emailAddress && req.body.password){
      User.authenticate(req.body.emailAddress, req.body.password, function (error, user) {
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
      let err = new Error('email and password are required');
      err.status = 401;
      return next(err);
  }
}

module.exports.userAuthentication = userAuthentication;
