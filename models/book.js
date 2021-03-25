const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
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

const Book = new mongoose.model('books',bookSchema);
module.exports = Book;