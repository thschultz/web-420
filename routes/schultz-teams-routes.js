// WEB 420 RESTful API
// Contributors

// Richard Krasso
// Thomas James Schultz

const express = require("express");
const router = express.Router();
const Team = require("../models/schultz-team.js");

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning an array of team documents.
 *     summary: Returns an array of team documents in JSON format.
 *     responses:
 *       '200':
 *         description: Array of team documents
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// findAllTeams try...catch block.
router.get("/teams", (req, res) => {
    try {
        Team.find({}, function (err, teams) { // Queries teams collection from Team model.
            if (err) {
                res.status(501).send({
                    "message": `MongoDB Exception ${err}`
                  })
            } else {
                res.json(teams); // Returns team documents.
            }
        })
    } catch (e) {
        res.status(500).send({
            "message": `Server Exception: ${e}`
          })
    }
})

/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for assigning player to a team document.
 *     summary: Assigns a player to a team.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The teamID the player will be assigned to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              description: Player's information
 *              required:
 *                - firstName
 *                - lastName
 *                - Salary
 *              properties:
 *                firstName:
 *                  description: Player's first name
 *                  type: string
 *                lastName:
 *                  description: Players's last name
 *                  type: string
 *                Salary:
 *                  description: Player's salary
 *                  type: number
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// assignPlayerToTeam try...catch block.
router.post("/teams/:id/players", async(req, res) => {
    try {
		Team.findOne({ "_id": req.params.id }, function(err, team) {
			if (err) {
			  console.log(err);
			  res.status(501).send({
				"message": `MongoDB Exception ${err}`
			  })
			} else {
			  console.log(team);
			  res.status(200).send({
				"message": "Player added to team."
			  })
  
			  const addPlayer = {
				firstName: req.body.firstName,
                lastName: req.body.lastName,
                Salary: req.body.Salary
			  }
  
			  team.players.push(addPlayer);
			  team.save();
			}
		});
	} catch (e) {
		console.log(e);
		res.status(500).send({
		  "message": `Server Exception: ${e}`
		})
	}
  });


/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning an array of player documents by Team ID.
 *     summary: Returns a player document.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The Team ID requested by the user.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of player documents
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// findAllPlayersByTeamId try...catch block.
router.get("/teams/:id/players", async(req, res) => {
    try {
        // Query teams collection with findOne() function and RequestParams id on Team model.
        Team.findOne({ "_id": req.params.id }, function(err, team) { // [Ref C]
            if (err) {
                res.status(501).send({
                    "message": `MongoDB Exception ${err}`
                  })
            } else {
                res.json(team);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            "message": `Server Exception: ${e}`
          })
    }
});

/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamById
 *     description: API to delete an existing team by ID.
 *     summary: Delete a team by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The team's ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// deleteTeamById try...catch block.
router.delete("/teams/:id", async(req, res) => {
    try {
        Team.findByIdAndDelete({ "_id": req.params.id }, function(err, team) {
            if (team) {
                // Returned deleted team document.
                res.json(team);

            } else {
                console.log(err);
                res.status(501).send({
                    "message": `MongoDB Exception ${err}`
                })
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            "message": `Server Exception: ${e}`
        })
    }
});

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     name: createTeam
 *     description: API for adding a new team document to MongoDB Atlas.
 *     summary: Creates a new team document.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              description: Team information
 *              required:
 *                - name
 *                - mascot
 *              properties:
 *                name:
 *                  description: Team name
 *                  type: string
 *                mascot:
 *                  description: Team mascot
 *                  type: string
 *     responses:
 *       '200':
 *         description: Team added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// createTeam try...catch block.
router.post("/teams", async(req, res) => {
    try {
        // Create object literal Team and map fields from RequestBody to its properties.
        let team = new Team ({
            name: req.body.name,
            mascot: req.body.mascot
        });
        // Call create() function on Team model.
        Team.create(team, function (err, addTeam) {
            if (err) {
                res.status(501).send({
                    "message": `MongoDB Exception ${err}`
                  })
            } else {
                res.json(addTeam);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            "message": `Server Exception: ${e}`
          })
    }
})

module.exports = router;