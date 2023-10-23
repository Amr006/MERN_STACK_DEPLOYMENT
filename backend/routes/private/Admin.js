const express = require('express')
const router = express.Router();
const adminControllers = require('../../controllers/adminControllers')
const authenticateMidd = require('../../middleware/authenticate')

router.post("/addAdmin" ,authenticateMidd ,adminControllers.addAdmin)

router.post("/addTournament" , authenticateMidd , adminControllers.addTournament)

router.delete("/deleteTournament/:id" , authenticateMidd ,adminControllers.deleteTournament )

module.exports = router