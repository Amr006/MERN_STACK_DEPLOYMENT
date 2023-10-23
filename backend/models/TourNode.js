const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TourNode = new Schema({
    tournamentID:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
    } ,
    gameID: String ,
    gameLink: String ,
    userName1: String,
    userName2: String,
    round: Number,
    createdAt: Date,
    nodeNumber: Number,
    firstUserEntered : { type: Date },
    secondUserEntered : { type: Date },
    winner:{
      type: String ,
      default: "*",
    }
})


const Node = mongoose.model("TourNodes", TourNode);

module.exports = Node;