const mongoose = require('mongoose')


const Schema = mongoose.Schema ;

const FinishedTournamentSchema = Schema({

  _id: Schema.Types.ObjectId ,
  Name : {
    type : String ,
    required : true ,
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

  }


})

module.exports = mongoose.model("FinishedTournament" , FinishedTournamentSchema)