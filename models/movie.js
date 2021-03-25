const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    link:{
        type:String
    } 
})

const Movie = new mongoose.model('movies',movieSchema);
module.exports = Movie;