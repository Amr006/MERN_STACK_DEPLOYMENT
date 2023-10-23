const Node = require("../models/PointsTournamentNode");
const Tournament = require("../models/Tournament");
const FinishedTournament = require("../models/FinishedTournament");
const roundrobin = require("roundrobin-tournament-js");
const fs = require("fs");

//const lodash = require("lodash");
const axios = require("axios");
const { round } = require("lodash");
const { Console } = require("console");

var timeValue = new Map();

timeValue.set("Rapid", 600);
timeValue.set("Blitz", 300);
timeValue.set("Classic", 1800);

const displayNodes = async (req, res, next) => {
  const tournament_Id = req.params.id;
  console.log("result");
  await Node.find({ tournamentID: tournament_Id },"-_id")
    .populate("tournamentID")
    .then(async (result) => {
      if (result.length !== 0) {
        var roundNumber =
          Math.floor(
            result[0].tournamentID.FinishedMatches /
              (result[0].tournamentID.Players.length / 2)
          ) + 1;
        return res.status(200).json({
          data: result,
          current_round: roundNumber,
        });
      } else {
        var data = [];
        await Tournament.findOne({ _id: tournament_Id })
          .then(async (result) => {
            //console.log(result);

            if (result) {
              var arr = result.Players;
              const rounds = roundrobin(arr);
              console.log(rounds);

              var data = {};

              for (var i = 0; i < arr.length; i++) {
                data[arr[i]] = [];
              }

              for (var i = 0; i < rounds.length; i++) {
                for (let j = 0; j < rounds[i].length; j++) {
                  let playerOne = rounds[i][j][0];
                  let playerTwo = rounds[i][j][1];

                  let formData = new URLSearchParams();
                  var nodeTime = timeValue.get(result.Time);
                  formData.append("clock.limit", nodeTime);
                  formData.append("users", `${playerOne},${playerTwo}`);
                  formData.append("clock.increment", 0);

                  try {
                    let response = await axios.post(
                      "https://lichess.org/api/challenge/open",
                      formData,
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                      }
                    );

                    var MatchOne = {
                      Player: playerTwo,
                      gameID: response.data.challenge.id,
                      gameLink: response.data.challenge.url,
                      round: i + 1,
                    };
                    var MatchTwo = {
                      Player: playerOne,
                      gameID: response.data.challenge.id,
                      gameLink: response.data.challenge.url,
                      round: i + 1,
                    };

                    data[playerOne].push(MatchOne);
                    data[playerTwo].push(MatchTwo);
                  } catch (error) {
                    console.log(error);
                    res.json(error);
                  }
                }
              }

              var WholeData = [];
              //console.log(data)
              var keys = Object.keys(data);
              console.log(keys);
              for (let i = 0; i < keys.length; i++) {
                var playerMatches = new Node({
                  Name: keys[i],
                  tournamentID: tournament_Id,
                  Matches: data[keys[i]],
                });
                try {
                  await playerMatches.save();
                  WholeData.push(playerMatches);
                  console.log(WholeData);
                } catch (err) {
                  console.log(err);
                }
              }

              console.log("WholeData");
              console.log(WholeData);
              // return res.status(200).json({
              //   data: WholeData,
              //   current_round: 1,
              // });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};

const gameEnds = async (req, res, next) => {
  const game_Id = req.params.game_Id;
  console.log(game_Id);
  //console.log(req.forfree);

  try {
    if (req.hasOwnProperty("forfree")) {
      var winnerName = req.forfree;
      var response = { data: {} };
    } else {
      var response = await axios.get(
        `https://lichess.org/game/export/${game_Id}`,
        {
          headers: {
            accept: "application/json",
          },
        }
      );

      //console.log(response.data);
      if (response.status === 200) {
        console.log("Request successful");
        // Handle successful response
      } else {
        console.log("Request failed with status:", response.status);
        // Handle other statuses
      }

      if (
        response.data.hasOwnProperty("winner") ||
        response.data.status == "draw"
      ) {
        if (response.data.status != "draw") {
          var winner = response.data.winner;
          var winnerName = response.data.players[winner].user.name;
        }
      } else {
        //console.log("the game is not finished yet !!");
        return res.status(404).json({
          message: "the game is not finished",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "game is not started yet",
      error: err,
    });
  }
  const data = await Node.find({
    Matches: { $elemMatch: { gameID: game_Id , winner : "*" } }, // Matches the specified element in the Matches array
  }).populate("tournamentID");
  console.log(game_Id);
  if(data.length == 0)
  {
    return res.status(403).json({
      message: "the game is already finished",
    });
  }
  var roundNumber =
    Math.floor(
      data[0].tournamentID.FinishedMatches /
        (data[0].tournamentID.Players.length / 2)
    ) + 1;
  


  
  
  if (
    response.data.hasOwnProperty("status") &&
    response.data.status == "draw" &&
    data[0].Matches[roundNumber - 1].winner == "*"
  ) {
    data[0].Matches[roundNumber - 1].winner = "draw";
    data[0].Points += 1;
    data[1].Matches[roundNumber - 1].winner = "draw";
    data[1].Points += 1;
    data[0].tournamentID.FinishedMatches += 1;
  } else {
    if (
      data[0].Name == winnerName &&
      data[0].Matches[roundNumber - 1].winner == "*"
    ) {
      data[0].Matches[roundNumber - 1].winner = winnerName;
      data[0].Points += 2;
      data[1].Matches[roundNumber - 1].winner = winnerName;
      data[0].tournamentID.FinishedMatches += 1;
    } else if (data[0].Matches[roundNumber - 1].winner == "*") {
      data[1].Matches[roundNumber - 1].winner = winnerName;
      data[1].Points += 2;
      data[0].Matches[roundNumber - 1].winner = winnerName;
      data[0].tournamentID.FinishedMatches += 1;
    }
  }

  const promises = data.map((document) => document.save());
  await Promise.all(promises);
  var roundNumber =
    Math.floor(
      data[0].tournamentID.FinishedMatches /
        (data[0].tournamentID.Players.length / 2)
    ) + 1;

  if (roundNumber == data[0].tournamentID.Players.length) {
    const final = await Node.find({tournamentID: data[0].tournamentID});
    
    var finalWinner;
    var Points = 0;
    console.log("final");
    console.log(final);
    for (let i = 0; i < final.length; i++) {
      if (Points < final[i].Points) {
        Points = final[i].Points;
        finalWinner = final[i].Name;
      }
    }

    
    // const deleteResult = await Tournament.deleteOne({ _id: data[0].tournamentID });
    var tournamentToDelete = data[0].tournamentID;
    const temp = new FinishedTournament(
      {
        _id: tournamentToDelete._id,
        Name: tournamentToDelete.Name,
        Type: tournamentToDelete.Type,
        Time: tournamentToDelete.Time,
        Players: tournamentToDelete.Players,
        Description: tournamentToDelete.Description,
        Max: tournamentToDelete.Max,
        StartsAt: tournamentToDelete.StartsAt,

        Winner: tournamentToDelete.Winner,
        Creator: tournamentToDelete.Creator,
        EndedAt: Date.now(),
      },
      { _id: false }
    );
    //await temp.save();
    data[0].tournamentID.Winner = finalWinner;
    data[0].tournamentID.EndedAt = Date.now();
  }
  await data[0].tournamentID.save();
  req.params.id = data[0].tournamentID;
  return next();
};

const abortMatch = async (req, res, next) => {
  const user = req.userName;
  const game_Id = req.params.game_Id;
  console.log(game_Id);
  const timeNow = Date.now();

  await Node.find({
    Matches: { $elemMatch: { gameID: game_Id } },
  })
    .populate("tournamentID")
    .then((result) => {
      try {
        const round =
          Math.floor(
            result[0].tournamentID.FinishedMatches /
              (result[0].tournamentID.Players.length / 2)
          ) + 1;
        if (
          !result[0].Matches[round - 1].hasOwnProperty("secondUserEntered") &&
          result[0].Matches[round - 1].firstUserEntered.User == user
        ) {
          var timeDifferenceMs =
            result[0].Matches[round - 1].firstUserEntered.Time.getTime() -
            timeNow;
          //console.log(Math.abs(timeDifferenceMs / (1000 * 60)));
          if (Math.abs(timeDifferenceMs / (1000 * 60)) > 3) {
            req.forfree = user;
            console.log(user);
            return next();
          }
        }
        return res.status(402).json({
          message: `Can't abort this match now`,
        });
      } catch (err) {
        return res.status(402).json({
          message: `Can't abort this match now`,
        });
      }
    });
};

const savingEntry = async (req, res, next) => {
  const user = req.userName;
  const game_Id = req.params.game_Id;

  await Node.find({
    Matches: { $elemMatch: { gameID: game_Id } },
  })
    .populate("tournamentID")
    .populate("Matches")
    .then(async (result) => {
      console.log(result);
      const round =
        Math.floor(
          result[0].tournamentID.FinishedMatches /
            (result[0].tournamentID.Players.length / 2)
        ) + 1;
      const timeNow = Date.now();
      const data = {
        User: user,
        Time: timeNow,
      };
      const newResult = result[0].Matches[round-1]

      console.log(round);
      console.log(newResult)
      console.log(result[0].Matches[round-1])
      console.log(result[0].Matches[round-1]["firstUserEntered"])
      console.log(result[0].Matches[round-1]["secondUserEntered"])
      console.log(newResult.firstUserEntered.User)
      console.log(newResult.firstUserEntered["User"])

      if (!newResult.firstUserEntered.User) {
        result[0].Matches[round - 1].firstUserEntered = data;
        result[1].Matches[round - 1].firstUserEntered = data;
      } else if (
        !newResult.secondUserEntered.User
      ) {
        result[0].Matches[round - 1].secondUserEntered = data;
        result[1].Matches[round - 1].secondUserEntered = data;
      }
      console.log(round);
      console.log(result[0].Matches[round - 1]);
      const promises = result.map((document) => document.save());
      await Promise.all(promises);

      res.status(200).json({
        message: "User entered match successfully !",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const displayFinishedTournamentsNodes = (req, res, next) => {
  console.log(req.params);
  const tournament_Id = req.params.id;
  Node.find({ tournamentID: tournament_Id })
    .populate("tournamentID")
    .then(async (result) => {
      console.log(result);
      if (result.length !== 0) {
        return res.status(200).json({
          data: result,
        });
      }
    });
};

module.exports = {
  displayNodes,
  gameEnds,
  savingEntry,
  abortMatch,
  displayFinishedTournamentsNodes,
};
