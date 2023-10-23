const mongoose = require('mongoose')

const Schema = mongoose.Schema ;

const MatchesSchema = Schema({
  Player: String,
  gameID: String,
  gameLink: String,
  round: Number,
  firstUserEntered: {
    User: String,
    Time: Date,
  },
  secondUserEntered: {
    User: String,
    Time: Date,
  },
  winner: {
    type: String,
    default: "*",
  },
});

const PointsTournamentSchema = Schema({
  Name : {
    type : String ,
    required : true
  }
  ,
  tournamentID:{
    type : mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  } 
  ,
  Matches:[MatchesSchema]
  ,
  Points :{
    type : Number ,
    default : 0
  },
})

module.exports = mongoose.model("PointsTournament" , PointsTournamentSchema)