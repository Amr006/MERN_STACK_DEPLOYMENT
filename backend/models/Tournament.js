const mongoose = require('mongoose')
var valid = require('validator');

const Schema = mongoose.Schema ;

const TournamentSchema = Schema({

  Name : {
    type : String ,
    required : true
  }
  ,
  Type : {
    type : String ,
    enum : ['Brackets' , 'Points' ] ,
  }
  ,
  Time : {
    type : String ,
    enum : ['Rapid' , 'Blitz' , 'Classic'],
    required : true
  }
  ,
  Players : {
    type : [String] ,
    default : []
  }
  ,
  Description : String
  ,
  Max : {
    type : Number ,
    required : true 
  }
  ,
  StartsAt : {
    type : Date ,
    required : true 
  } ,
  Winner: {
    type : String ,
    default: "*"
  },
  Creator: {
    type:String ,
    
  },
  EndedAt : {
    type : Date ,

  },
  Password : {
    type : String 
  },
  FinishedMatches: {
    type : Number ,
    default : 0
  },
  EndedAt : {
    type : Date ,

  }



})

module.exports = mongoose.model("Tournament" , TournamentSchema)