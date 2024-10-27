
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');

const JWT_SECRET = "my-secret-code";

// async allows to use await
async function signup(req, res) {
    const {name,password,email,phone} = req.body; 

    const user = new User({name, password, email, phone}); //creates a user
    
    try {
        
        await user.save(); // await makes it a blocking operation. saves the user to the DB

        // Send verification email
        sendVerificationEmail(user.email, user.id);
    } 

    catch(error){ //catches all errors 
        if (error.code === 11000) {
            return res.status(400).send({"message": "Email already exists"});
        }

        return res.status(500).send({"message": "Something went wrong"});
    }

    res.status(201).send({"message": "Verify Email"}); // return response with status 201 and the user (back to the client)
}

async function signin(req, res) {
    const {password, email} = req.body;
    
    try {
        const user = await User.findOne({ password, email });
        if (user) {
            
            if (!user.isVerified)
            {
                return res.status(404).send({ "message": 'User is not verified' });
            }

            // Generate token after finding the user
            const token = jwt.sign({success: true, name: user.name, userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            
            res.status(200).send({token});
        } else {
            console.log('User not found');
            res.status(404).send({success: false, "message": 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).send({success: false, "message": 'Server error' });
    } // await makes it a blocking operation. saves the user to the DB

}

async function verify(req, res)
{
    const code = req.param("verifyCode");
    const user = await User.findOne({"_id": code});

    if (!user) {
        return res.status(400).send({ "message": 'user not found' });
    } 

    if (user.isVerified){
        return res.status(400).send({ "message": 'user already verified' });
    }
    
    user.isVerified = true;

    await user.save();

    res.status(303).redirect('http://10.10.1.194:5500/projects/bank/front/index.html');
}

module.exports = {signup, signin, verify, JWT_SECRET} //this export the signup fucntion for the whole project

