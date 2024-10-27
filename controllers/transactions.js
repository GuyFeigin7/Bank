const Transaction = require("../models/transactions.js");
const User = require("../models/user.js");
const {JWT_SECRET} = require("./user.js")
const jwt = require('jsonwebtoken');

async function makeTransaction(req, res) {
    const {email, amount} = req.body; // Expect email and amount in the request body 
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

    if (amount <= 0) {
        return res.status(401).send({ message: "Invalid amount"});
    }

    if (!token) {
        return res.status(401).send({ message: "Authorization failed, no token provided"});
    }

    let currentUser;
    try {
        currentUser = jwt.verify(token, JWT_SECRET); // Decode the token using your secret
    } catch (err) {
        console.log("makeTransaction failed: token verification error", err);
        return res.status(401).send({ message: "Authorization failed, invalid token"});
    }

    // Add check to see if user has enough money
    // If they don't, cancel/reverse the transaction
    
    // Find the recipient of the transaction 
    const receiver = await User.findOne({ email });
    if (!receiver) {
        return res.status(404).send({ message: "Transaction recipient not found"})
    }

    const newTransaction = new Transaction({
        sender: { name: currentUser.name, id: currentUser.userId },
        receiver: { name: receiver.name, id: receiver._id },
        amount: amount, 
    });

    try {
        await newTransaction.save();
        res.status(201).send({ message: "Transaction successful", newTransaction });
    } catch (err) {
        console.error('Error saving transaction: ', err);
        res.status(500).send({ message: "Server error while saving transaction" });
    }
}

async function getTransactions(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).send({ message: "Authorization failed: no token provided" });
    }

    let currentUser;
    try {
        currentUser = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).send(({ message: "Authorization error: invalid token" }));
    }

    // Fetch transactions where the current user is either the sender or recipient
    try {
        const transactions = await Transaction.find({
            $or: [
                { 'sender.id': currentUser.userId }, // Match sender ID
                { 'receiver.id:': currentUser.userId } // Match recipient ID
            ]
        });

        res.status(200).send({ transactions });
    } catch (err) {
        console.error("Error fetching transactions: ", err);
        res.status(500).send({ message: "Server error while fetching transactions" });
    }
}

module.exports = {getTransactions, makeTransaction};