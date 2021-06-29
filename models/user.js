const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passprotLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },      
    
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passprotLocalMongoose);  // this plugin can handle
// the username and password(which were removed above) by hashing and salting, etc

module.exports = mongoose.model('User', userSchema)