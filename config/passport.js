const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Load User model

const User = require("../models/Users");

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            // Match User
            User.findOne({email:email})
            .then((user)=>{
                if(!user){
                    return done(null,false,{ message:"That email not registered" })
                }

                // Match Password if matches then we get user from db and skip the first if
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;

                    if(isMatch){
                        return done(null,user);
                    } else{
                        return done(null,false,{ message:"Password incorrect" });
                    }
                })
            })
            .catch(err=>console.log(err))
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });

}