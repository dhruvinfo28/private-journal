const mongoose = require('mongoose')

const journalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    journal:{
        type: String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
}) 

const Journal = new mongoose.model('journals', journalSchema);

module.exports = Journal;