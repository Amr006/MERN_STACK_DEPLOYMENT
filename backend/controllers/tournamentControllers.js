const Node = require("../models/TourNode");
const Tournament = require("../models/Tournament");
const FinishedTournament = require("../models/FinishedTournament");
const lodash = require("lodash");
const axios = require("axios");

var timeValue = new Map();

timeValue.set("Rapid", 600);
timeValue.set("Blitz", 300);
timeValue.set("Classic", 1800);

const displayNodes = async (req, res, next) => {
  //  console.log("result");
  console.log("result");
  const tournament_Id = req.params.id;

  await Node.find({ tournamentID: tournament_Id })
    .populate("tournamentID")
    .then(async (result) => {
      console.log(result);
      if (result.length !== 0) {
        return res.status(200).json({
          data: result,
        });
      } else {
        let data = [];
        await Tournament.findOne({ _id: tournament_Id })
          .then(async (result) => {
            console.log(result);
            if (result) {
              let arr = lodash.shuffle(result.Players);
              let j = 1;
              for (let i = 0; i < arr.length; i += 2) {
                let formData = new URLSearchParams();
                var nodeTime = timeValue.get(result.Time);

                formData.append("clock.limit", nodeTime);
                formData.append("users", `${arr[i]},${arr[i + 1]}`);
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

                  let temp = new Node({
                    tournamentID: tournament_Id,
                    gameID: response.data.challenge.id,
                    gameLink: response.data.challenge.url,
                    userName1: arr[i],
                    userName2: arr[i + 1],
                    round: 1,
                    createdAt: Date.now(),
                    nodeNumber: j,
                  });

                  try {
                    await temp.save();
                  } catch (error) {
                    console.log(error);
                  }
                  data.push(temp);

                  j++;
                } catch (error) {
                  console.log(error);
                  return res.json(error);
                }
              }
              data[0].tournamentID = result;
              // return res.status(200).json({
              //   data: data,
              // });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const gameEnds = async (req, res, next) => {
  //console.log(req.params);
  const game_Id = req.params.game_Id;
  const node_Id = req.params.node_id;

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
        console.log("the game is not finished yet !!");
        return res.status(404).json({
          message: "the game is not finished yet!!",
        });
      }
    }
  } catch (err) {
    return res.status(404).json({
      message: "the game is not finished yet!!",
    });
  }

  await Node.findOne({ _id: node_Id })
    .populate("tournamentID")
    .then(async (result1) => {
      if (
        response.data.hasOwnProperty("status") &&
        response.data.status == "draw"
      ) {
        console.log("draw");
        let formData = new URLSearchParams();
        var nodeTime = timeValue.get(result1.tournamentID.Time);
        formData.append("clock.limit", nodeTime);

        formData.append("users", `${result1.userName1},${result1.userName2}`);

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

          result1.gameID = response.data.challenge.id;
          result1.gameLink = response.data.challenge.url;
          try {
            await result1.save();
            console.log("Hello");
            req.params.id = result1.tournamentID;
            return next();
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }

      console.log(result1);
      if (result1) {
        var number = result1.nodeNumber;
        var first = false;
        if (result1.nodeNumber % 2 == 0) {
          number = parseInt(number / 2);
        } else {
          number = parseInt(number / 2) + 1;
          first = true;
        }

        result1.winner = winnerName;
        try {
          let saveresult = await result1.save();
        } catch (error) {
          console.log(error);
        }
        await Node.findOne({
          $and: [
            { nodeNumber: number },
            { round: result1.round + 1 },
            { tournamentID: result1.tournamentID._id },
          ],
        })
          .populate("tournamentID")
          .then(async (result) => {
            if (result) {
              console.log("result00");
              console.log(result);
              let formData = new URLSearchParams();
              var nodeTime = timeValue.get(result.tournamentID.Time);
              console.log(result.tournamentID);
              formData.append("clock.limit", nodeTime);
              if (first) {
                formData.append("users", `${result.userName2},${winnerName}`);
              } else {
                formData.append("users", `${result.userName1},${winnerName}`);
              }

              formData.append("clock.increment", 0);
              console.log(formData);
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
                if (first) {
                  result.userName1 = winnerName;
                } else {
                  result.userName2 = winnerName;
                }
                result.gameID = response.data.challenge.id;
                result.gameLink = response.data.challenge.url;
                try {
                  await result.save();
                  console.log("Hello");
                  req.params.id = result1.tournamentID;
                  return next();
                } catch (error) {
                  console.log(error);
                }
              } catch (error) {
                console.log(error);
              }
            } else {
              if (
                result1.round == Math.log2(result1.tournamentID.Players.length)
              ) {
                // const updatedData = {
                //   Finished: true,
                //   Winner: winnerName,
                //   EndedAt : Date.now()
                //   // Add more fields and values to update as needed
                // };

                try {
                  // Step 1: Query the document from the "Tournament" collection
                  const tournamentToDelete = await Tournament.findOne({
                    _id: result1.tournamentID,
                  });

                  if (!tournamentToDelete) {
                    return res.status(404).json({
                      message: "Tournament not found!",
                    });
                  }

                  // Step 2: Delete the document from the "Tournament" collection
                  // const deleteResult = await Tournament.deleteOne({ _id: result1.tournamentID });

                  tournamentToDelete.Winner = winnerName;
                  tournamentToDelete.EndedAt = Date.now();
                  console.log("tournamentToDelete");

                  // Step 3: Create a new instance of "FinishedTournament" and save it to the collection
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
                  console.log(temp);
                  //await temp.save();
                  await tournamentToDelete.save();

                  console.log("Tournament Finished!!");
                  req.params.id = result1.tournamentID;
                  return next();
                } catch (err) {
                  console.error("Error moving tournament:", err);
                  return res.status(500).json({
                    message: "Internal server error",
                  });
                }
              } else {
                if (first) {
                  var temp = new Node({
                    tournamentID: result1.tournamentID,
                    userName1: winnerName,
                    round: result1.round + 1,
                    createdAt: Date.now(),
                    nodeNumber: number,
                  });
                } else {
                  var temp = new Node({
                    tournamentID: result1.tournamentID,
                    userName2: winnerName,
                    round: result1.round + 1,
                    createdAt: Date.now(),
                    nodeNumber: number,
                  });
                }
                try {
                  await temp
                    .save()
                    .then((result) => {
                      console.log("Node saved ! ");
                      req.params.id = result1.tournamentID;
                      return next();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } catch (err) {
                  console.log(err);
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const displayTournaments = (req, res, next) => {
  Tournament.find()
    .then((result) => {
      if (result) {
        res.status(200).json({
          data: result,
        });
      } else {
        res.status(200).json({
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
};

const displayTournamentsById = (req, res, next) => {
  const id = req.params.id;
  Tournament.findOne({ _id: id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Tournament not Found ! ",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
};

const abortMatch = async (req, res, next) => {
  const timeNow = Date.now();
  const user = req.userName;
  const node_Id = req.params.node_id;
  //  const game_Id = req.params.game_id;

  await Node.findOne({ _id: node_Id })
    .then((result) => {
      try {
        if (user == result.userName1 && result.userName2) {
          var timeDifferenceMs = result.firstUserEntered.getTime() - timeNow;
          console.log(Math.abs(timeDifferenceMs / (1000 * 60)));
          if (
            Math.abs(timeDifferenceMs / (1000 * 60)) > 3 &&
            !result.hasOwnProperty("secondUserEntered")
          ) {
            req.forfree = user;
            return next();
          }
        }
        if (user == result.userName2 && result.userName1) {
          var timeDifferenceMs = result.secondUserEntered.getTime() - timeNow;
          console.log(Math.abs(timeDifferenceMs / (1000 * 60)));
          if (
            Math.abs(timeDifferenceMs / (1000 * 60)) > 3 &&
            !result.hasOwnProperty("firstUserEntered")
          ) {
            req.forfree = user;
            return next();
          }
        }
      } catch (err) {
        return res.status(402).json({
          message: `Can't abort this match now`,
        });
      }

      return res.status(402).json({
        message: `Can't abort this match now`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const savingEntry = async (req, res, next) => {
  const user = req.userName;
  const node_Id = req.params.node_id;
  console.log("hello");
  await Node.findOne({ _id: node_Id })
    .then(async (result) => {
      const timeNow = Date.now();
      if (user == result.userName1) {
        if (!result.hasOwnProperty("firstUserEntered")) {
          result.firstUserEntered = timeNow;
        }
      }
      if (user == result.userName2) {
        if (!result.hasOwnProperty("secondUserEntered")) {
          result.secondUserEntered = timeNow;
        }
      }
      await result.save();
      res.status(200).json({
        message: "User entered match successfully !",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const displayFinishedTournaments = (req, res, next) => {
  FinishedTournament.find()
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err,
      });
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
  displayTournaments,
  displayTournamentsById,
  savingEntry,
  abortMatch,
  displayFinishedTournaments,
  displayFinishedTournamentsNodes,
};
