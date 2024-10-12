const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase:true,
        unique:true,
        required: [true, 'Email field is required'],
        validate:{
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
          }
    },
    password: {
        type: String,
        required: [true, 'password field is required'],
        minlength: [6, 'password should atleast characters required'],
        validate:{
            validator: function(v){
                return /^(?=.*[A-Z])(?=.*[!@#$%^&*])^/.test(v)
            },
            message:'password should contain one uppercase and a specialcharacter'
        }

    }

});


const User = mongoose.model('User', userSchema);

module.exports = User;