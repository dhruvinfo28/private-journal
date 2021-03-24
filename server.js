require('dotenv').config()
const express = require('express')
const passport  = require('passport')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const Journal = require('./models/journal')

const app = express();

app.set('view engine','ejs');

//Mongo url:
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zw4zm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

//Middlewares
app.use(express.static("public"));

app.use(express.urlencoded());

app.use(cookieSession({
    maxAge:5*24*60*60*1000,
    keys:[process.env.COOKIE_KEY],
}))

require('./middlewares/passportConfig')

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI).then(()=>{console.log('Connected')})


app.get('/login',(req,res)=>{
    res.render('index');
})

app.get('/home', (req,res)=>{
    res.render('homePage')
})
//Auth routes

require('./routes/authRoutes')(app);

app.post('/addJournal',(req,res)=>{
    if(req.user){
        const email = req.user.email;
        const name = req.user.name;
        new Journal({
            email,
            name,
            journal: req.body.journals,
            date: Date.now()
        }).save()
            .then((a)=>{
                //Prompt saying journal recorded
                console.log(a)
                res.redirect('/diary')
            })
    }
})

const PORT = process.env.PORT || 3000 ;
app.listen(PORT);
