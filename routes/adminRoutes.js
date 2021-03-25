const bcrypt = require('bcrypt');
const Admin = require('../models/admin')
const Playlist = require('../models/movie')
const Book = require('../models/book')
const Quote = require('../models/quote')

module.exports = (app)=>{
    
    app.get('/admin/login',(req,res)=>{
        res.render('admin');
    })

    app.post('/admin/login',(req,res)=>{
        Admin.findOne({email:req.body.email})
            .then((admin)=>{
                if(admin){
                    bcrypt.compare(req.body.password,admin.password)
                        .then((result)=>{
                            if(result){
                                res.render('adminPost')
                            }
                            else{
                                res.send('password wrong');
                            }
                        })
                }
            })
    })

    app.post('/admin/content/playlist',(req,res)=>{
        new Playlist({
            category: req.body.category,
            title:req.body.title,
            content: req.body.content,
            link: req.body.link
        }).save().then(()=>{ res.render('adminPost')})
    })

    app.post('/admin/content/book',(req,res)=>{
        new Book({
            category: req.body.category,
            title:req.body.title,
            content: req.body.content,
            link: req.body.link
        }).save().then(()=>{ res.render('adminPost')})
    })

    app.post('/admin/content/quote',(req,res)=>{
        new Quote({
            category: req.body.category,
            quote: req.body.quote,
            writer: req.body.writer
        }).save().then(()=>{ res.render('adminPost')})
    })

    
}