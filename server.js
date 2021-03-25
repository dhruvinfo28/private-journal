require('dotenv').config()
const express = require('express')
const passport  = require('passport')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const vader = require('vader-sentiment');

//Models
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



//TODO need to display content from collections
app.get('/', (req,res)=>{
    res.render('homePage')
})

//OAuth routes
require('./routes/authRoutes')(app);

//Previous journals:
app.get('/previousJournals',(req,res)=>{
    res.render('PreviousJournals')
})

//Read Journal
app.get('/readJournal',(req,res)=>{
    res.render('ReadJournal');
})

//Adding a journal
app.post('/addJournal',(req,res)=>{
    if(req.user){
        const email = req.user.email;
        const name = req.user.name;
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(req.body.journals);
        new Journal({
            email,
            name,
            journal: req.body.journals,
            date: Date.now(),
            sentiment: intensity.compound,
        }).save()
            .then((a)=>{
                //Prompt saying journal recorded
                console.log(a)
                res.redirect('/diary')
            })
    }
})

//Route for overall analysis of daily journals

app.get('/yourStats',(req,res)=>{
    if(req.user){
        Journal.find({email:req.user.email})
            .then((result)=>{
                //compounds contain all compound scores for journals so far
                let compounds = [];
                for(let i=0;i<result.length;i++){
                    compounds.push(result[i].sentiment);
                }
                res.render('stats',{
                   scoreArray: compounds
                })
            })
            .catch((err)=>{
                console.log(err)
                res.send('Please try again later')
            })
    }
    else{
        res.redirect('/login')
    }
})

app.listen(process.env.PORT || 3000);
