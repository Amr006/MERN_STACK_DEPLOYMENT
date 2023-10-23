const mongoose = require("mongoose");
var valid = require("validator");

const Schema = mongoose.Schema;
const axios = require("axios");

const UserSchema = Schema({
  Email: {
    type: String,
    required: true,
    validate: {
      validator: (val) => {
        return valid.isEmail(val);
      },
      message: "invalide email !",
    },
  },
  Password: {
    type: String,
    required: true,
    minlength: 5,
  },
  //chessUserName
  Name: {
    type: String,
    required: true,
    validate: {
      validator: async function (val) {
        try {
          const response = await axios.get(
            `https://lichess.org/api/user/${val}`
          );
          console.log(response.data);
          return true;
        } catch (error) {
          console.log(error.response.data);
          return false;
        }
      },
      message: "Wrong Chess.com username!",
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "User",
  },
  tutorial : {
    type : Boolean ,
    default : true,
  }
});



module.exports = mongoose.model("User", UserSchema);
