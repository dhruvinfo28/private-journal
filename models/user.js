const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    googleID:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    email:{
        type: String
    }
})

const User = new mongoose.model('users',userSchema);

module.exports  = User ;