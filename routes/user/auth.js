const express = require('express')
const router = express.Router()
const passport = require( 'passport' );
// const passport = require( '../../config/passport.js' );
require( '../../config/passport.js' )( passport )

const jwt = require ( 'jsonwebtoken' );
const connection = require("../../config/database");

router.post('/login', 
passport.authenticate('web-local', { session: true}), //need to update from nuxt auth.
async function(req, res) {
  // console.log(req.user.user_id)
  const token = jwt.sign(req.user.user_id, 'JWT_SECRET_OR_KEY2');
  // console.log('token',token)
  return res.json({ token });
});

router.get('/me',
passport.authenticate(['web-jwt',], { session: false }),
  async function(req, res,) {
    const { userId } = req.user;
    // "SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = ?",
    // connection.query(`SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = "${userId}"`, (err,results) =>{
   
    connection.query(`SELECT * FROM mbsa_users WHERE user_id="${userId}"`, (err,results) =>{
    // connection.query(`SELECT * FROM nexplex_agriculture_users JOIN nexplex_server on server_id=1 WHERE id="${userId}"`, (err,results) =>{
   
   
      // console.log(results)
      if(err) console.log(err)
    // connection.query(`SELECT id FROM nexplex_agriculture_users JOIN nexplex_server on server_id=1 WHERE id="${userId}"`, (err,results) =>{
      else if (userId==results[0].user_id) {

        const userData =req.user;
        // const userData =results[0]

        return res.status(200).json(userData);
        // return res.send('heelo');
      } else {
        res.status(500).send('invalid token');
      }
    })
  }
);

module.exports = router