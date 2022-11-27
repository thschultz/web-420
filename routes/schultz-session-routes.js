// WEB 420 RESTful API
// Contributors

// Richard Krasso
// Thomas James Schultz

const express = require("express");
const User = require("../models/schultz-user.js");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/**
 * Signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - Users
 *     description: API for adding user to database.
 *     summary: adds user to database.
 *     requestBody:
 *         description: user information
 *         content:
 *             application/json:
 *                 schema: 
 *                     required:
 *                         - userName
 *                         - Password
 *                     properties:
 *                         userName:
 *                           type: string
 *                         Password:
 *                           type: string
 *                         emailAddress:
 *                           type: string 
 *     responses:
 *       '200':
 *         description: User added to database
 *       '401':
 *         description: Username is already in use
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */

router.post("/signup", async(req, res) => {
    try {
        User.findOne({ userName: req.body.userName }, function(err, user) {
            if(err) {
                res.status(501).send({
                    "message": `MongoDB Exception: ${err}`
                });
            } else {
                console.log(user);
                if(!user) {
                    const hashedPassword = bcrypt.hashSync(req.body.Password, saltRounds);
                    const newRegisteredUser = {
                        userName: req.body.userName,
                        Password: hashedPassword,
                        emailAddress: req.body.emailAddress
                    }
        
                    User.create(newRegisteredUser, function (err, user) {
                        if(err) {
                            res.status(500).send({
                                "message": `MongoDB Exception: ${err}`
                            })
                        } else {
                            res.json(user);
                        }
                    })
                } else if(user){
                    res.status(401).send({
                        "message": "Username is already in use"
                    });
                }
            }
        }); 
    } catch(e) {
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
});

/**
 * Login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Users
 *     description: API for logging in user.
 *     summary: user logs in with username/password
 *     requestBody:
 *         description: user information
 *         content:
 *             application/json:
 *                 schema: 
 *                     required:
 *                         - userName
 *                         - password
 *                     properties:
 *                         userName:
 *                           type: string
 *                         Password:
 *                           type: string 
 *                         
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid username and/or password
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
 router.post("/login", async(req, res) => {
    try{
        User.findOne({ userName: req.body.userName }, function(err, user) {
            if(err) {
                res.status(501).send({
                    "message": `MongoDB Exception: ${err}`
                });
            } else {
                if(user) {
                    let passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);
                    if(passwordIsValid) {
                        res.status(200).send({
                            "message": "User logged in"
                        });
                    } else {
                        res.status(401).send({
                            "message": "Invalid username and/or password"
                        });
                    }
                } else {
                    res.status(401).send({
                        "message": "Invalid username and/or password"
                    });
                }
            }
        });
        
    } catch(e) {
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
})

module.exports = router;