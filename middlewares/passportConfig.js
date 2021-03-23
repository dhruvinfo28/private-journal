const passport  = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')


passport.serializeUser((user,done)=>{
  done(null,user.id);
})

passport.deserializeUser((id,done)=>{
  User.findById(id)
    .then((user)=>{
      done(null,user);
    })
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_KEY,
    callbackURL: "/google/auth/callback"
  },
  (accessToken, refreshToken, profile, done) => {
      User.findOne({googleID:profile.id})
        .then((existingUser)=>{
            if(existingUser){
              done(null,existingUser);
            }
            else{
              new User({googleID:profile.id, name:profile.displayName, email: profile.emails[0].value}).save()
                .then((user)=>{
                  done(null,user);
                })
                .catch(err=>console.log(err))
            }
        })
        .catch(err=>console.log(err))
  }
));