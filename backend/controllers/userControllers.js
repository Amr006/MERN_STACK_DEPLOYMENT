const User = require("../models/UserSchema");
const Tournament = require("../models/Tournament");
const adminControllers = require("./adminControllers");

const joinTournament = async (req, res, next) => {
  const tournamentId = req.params.id;
  const userName = req.userName;
  try {
    const tournament = await Tournament.findOne({ _id: tournamentId });
    if (tournament.Players.includes(userName)) {
      return res.status(200).json({
        message: "You Joined Already",
        players_num: tournament.Players.length,
      });
    }
    if (tournament.Max == tournament.Players.length) {
      return res.status(200).json({
        message: "Tournament is Full !",
        players_num: tournament.Players.length,
      });
    }
    const fiveMinutesInMillis = 2 * 60 * 1000;
    console.log(Date.now() - fiveMinutesInMillis)
    console.log(tournament.StartsAt.getTime())
    if (tournament.StartsAt.getTime() - fiveMinutesInMillis < Date.now()) {
      return res.status(403).json({
        message: "Tournament is Closed!",
        players_num: tournament.Players.length,
      });
    }
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
  Tournament.findOneAndUpdate(
    { _id: tournamentId },
    { $push: { Players: req.userName } },
    { new: true }
  )
    .then((result) => {
      res.status(200).json({
        message: "You are Joined Successfully",
        players_num: result.Players.length,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
};

const EnterTournament = async(req, res, next) => {
  const tournamentId = req.params.id;

  Tournament.findOne({ _id: tournamentId })
    .then(async(result) => {
      console.log(result);
      //checking if the user registered for this tournament
      const tournamentTime = result.StartsAt;
      //checking time
      // tournamentTime < Date.now()
      if (tournamentTime <= Date.now()) {
        //res.redirect("/Bracket/:Tourid")

        if(result.Players.length == 0)
        {
          req.role = "Admin"
          req.message  = true ;
          await adminControllers.deleteTournament(req,res)
          return res.status(404).json({
            message: "there is no players",
          });
        }

        if (result.Type == "Points") {
          if (result.Players.length % 2 == 0) {
            return next();
          } else {
            req.role = "Admin"
            req.message  = true ;
            await adminControllers.deleteTournament(req,res)
            return res.status(404).json({
              message: "Number of Players is not allowed",
            });

          }
        }else{
        var check = Math.log2(result.Players.length);
        console.log(check);
        if (Number.isInteger(check) && check != 0) {
          next();
        } else {
          req.role = "Admin"
          req.message  = true ;
          adminControllers.deleteTournament(req,res)
          return res.status(404).json({
            message: "Number of Players is not allowed",
          });
        }}
      } else {
        return res.status(404).json({
          message: `Tournament is not started yet`,
        });
      }
    })
    .catch((err) => {
      console.log(err)
      return res.status(404).json({
        message: err,
      });
    });
};

const finishedTutorial = (req, res, next) => {
  const id = req.userId;
  User.findOneAndUpdate({ _id: id }, { tutorial: false }, { new: true })
    .then((result) => {
      res.status(200).json({
        message: "Tutorial finished successfully !",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { EnterTournament, joinTournament, finishedTutorial };
