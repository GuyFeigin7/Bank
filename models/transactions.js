const {Schema, default: mongoose} = require("mongoose"); // catch the specific export

// Create transaction model 
const transactionModel = new Schema(
    {
        sender: { name:{type:String, required: true}, id:{type:String, required: true}},
        receiver:{ name:{type:String, required:true}, id:{type:String, required:true}},
        amount:{type:String, required:true},
    });


module.exports = mongoose.model("transactions", transactionModel);
