require('dotenv').config()
const express = require('express')
const passport  = require('passport')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')

const app = express();

app.set('view engine','ejs');

//Mongo url:
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zw4zm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

//Middlewares
app.use(express.static("public"));

// app.use(express.urlencoded());

app.use(cookieSession({
    maxAge:5*24*60*60*1000,
    keys:[process.env.COOKIE_KEY],
}))

require('./middlewares/passportConfig')

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI).then(()=>{console.log('Connected')})

require('./routes/authRoutes')(app);





app.get('/login',(req,res)=>{
    res.render('index');
})



const PORT = process.env.PORT || 3000 ;
app.listen(PORT);
