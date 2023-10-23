const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const verifyaccountsSchema = new Schema({

    userId: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date


})

const verifyaccounts = mongoose.model("verifyaccounts", verifyaccountsSchema);

module.exports = verifyaccounts;