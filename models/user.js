const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  
    userName:{ type:String,require:true, unique:true}, //tekil olması yani aynı kullanıcı adı olmaması icin unique true oldu
    phoneNumber:{ type:String,require:true, unique:true},//tekil olması yani aynı email olmaması icin unique true oldu
    email:{ type:String,require:true, unique:true}, //tekil olması yani aynı email olmaması icin unique true oldu
    password:{ type:String,require:true}
})


module.exports = mongoose.model('User ',UserSchema)