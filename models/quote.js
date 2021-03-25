const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    quote: {
        type:String,
        required:true
    },
    writer:{
        type:String
    }
})

const Quote = new mongoose.model('quotes',quoteSchema);
module.exports = Quote;