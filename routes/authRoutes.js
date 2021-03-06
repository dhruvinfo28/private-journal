const passport = require('passport')


module.exports = (app)=>{
    app.get('/google/auth',passport.authenticate('google',{
        scope:['profile','email']
    }))
    
    app.get('/google/auth/callback',passport.authenticate('google'),(req,res)=>{
        res.redirect('/diary');
    });

    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/')
    })

    app.get('/diary',(req,res)=>{
        if(!req.user){
            res.redirect('/')
        }
        else{
            res.render('Diary',{name:req.user.name})
        }
    })

}

