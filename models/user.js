const {Schema, default: mongoose} = require("mongoose"); // catch the specific export

// we created a new model
const userModel = new Schema(
    {
        name:{type:String, required: true},
        password:{type:String, required: true},
        email:{type:String, required: true, unique: true},
        phone:{type:String},
        isVerified: { type: Boolean, default: false },
    });


module.exports = mongoose.model("users", userModel); // we exported it to the rest of the program and "users" is the name of the collection 
