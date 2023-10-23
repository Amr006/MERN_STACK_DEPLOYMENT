const express = require('express')
const router = express.Router();
const TournamentControllers = require("../../controllers/tournamentControllers")

router.get("/Tournaments" , TournamentControllers.displayTournaments )
router.get("/Tournaments/:id" , TournamentControllers.displayTournamentsById )

module.exports = router