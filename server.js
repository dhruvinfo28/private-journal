require('dotenv').config()
const express = require('express')
const passport  = require('passport')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const vader = require('vader-sentiment');

//Models
const Journal = require('./models/journal')
const Movie = require('./models/movie')
const Book = require('./models/book')
const Quote = require('./models/quote')

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

let user_score=0;
let user_array = [];

app.get('/home',(req,res)=>{
    let  books, movies,quotes,category;
        if(user_score>90){
            category = 'depression'
        }
        else if(user_score<20){
            category = 'happy'
        }
        else if(user_array.length>0){
            let max_index = 0;
            let max = user_array[0];
            for(let i=1; i<user_array.length;i++){
                if(user_array[i]>max){
                    max = user_array[i];
                    max_index = i;
                }
            }
            /*
            index 0: Relationships
            index 1: Work
            index 2: health
            index 3: loss
            */
            switch(max_index){
                case 0: category = 'relations'; break;
                case 1: category = 'work'; break;
                case 2: category = 'health'; break;
                case 3: category = 'loss'; break;
            }
        }
        Movie.find({category:category}).limit(2)
            .then((result)=>{
                movies = result;
                console.log(movies)
                Book.find({category:category}).limit(2)
                .then((result)=>{
                    books = result;
                    Quote.find({category:category}).limit(2)
                    .then((result)=>{
                        quotes = result;
                        res.render('HomePage',{
                            movies:movies,
                            books:books,
                            quotes:quotes
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
})



//TODO need to display content from collections
app.get('/', (req,res)=>{
    res.render('index')
})

//OAuth routes
require('./routes/authRoutes')(app);

//Previous journals:
app.get('/previousJournals',(req,res)=>{
    if(req.user){
        Journal.find({email:req.user.email}).sort({date:-1})
            .then((data)=>{
                res.render('PreviousJournals',{journalArray: data})
            })
            
    }
    else{
        res.redirect('/')
    }
})

//Read Journal
app.get('/readJournal/:id',(req,res)=>{
    if(req.user){
        Journal.findById(req.params.id)
            .then((result)=>{
                console.log(result);
                res.render('ReadJournal',{journal: result});
            })
    }
    else{
        res.redirect('/');
    }
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

//Mood Analysis
app.get('/quiz',(req,res)=>{
    if(req.user){
        res.render('Question')
    }
})

//Bot 
app.get('/care',(req,res)=>{
    res.render('Care');
})

//Handle category info

app.post('/categories',(req,res)=>{
    if(req.user){
        let x = req.body.cat;
        x = x.split(',');
        let sum = 0;
        for(let i=0;i<x.length;i++){
            sum+= parseInt(x[i]);
        }
        user_score = sum;
        user_array = x;
    }
})

app.listen(process.env.PORT || 3000);
