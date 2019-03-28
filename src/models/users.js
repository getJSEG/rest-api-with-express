'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

//simple regex for full and email validation
const emailRegex = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
const fullNameRegex = new RegExp("^[a-zA-Z ]+$");

const UserSchema = new Schema({
    fullName: {
      type: String,
      required: [true, 'Full Name Required'],
      validate: {
        validator: function (name) {
          return fullNameRegex.test(name)
        },
        message: `Full Name Required`
      }
    },
    emailAddress:{
      type: String,
      required: [true, 'Email Required'],
      unique: true,
      validate: {
        validator: function (email){
          return emailRegex.test(email);
        },
        message: props => `${props.value} is not a valid email`
      }
    },
    password: {
      type: String, required: true
    }
});

//hashing and salting password before saving it
UserSchema.pre('save', function(next) {
  let user = this;

  bcrypt.hash(user.password, 12, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next();
  });
});

//user authentication
UserSchema.statics.authenticate = (emailAdress, password, callback) => {
  User.findOne({ emailAddress: emailAdress })
  .exec(function (err, user) {
     if(err){
       return callback(err);
     }else if( !user ){
       var err = new Error('user not Found');
       err.status = 401;
       return callback(err);
     }else{
       bcrypt.compare(password, user.password, function(error, result){
         if(result == true){
           return callback(null, user)
         } else { return  callback(); }
       });
     }
  });
}

let User = mongoose.model('User', UserSchema);

module.exports.User = User;
