const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

const connection  = require('../../config/database');

router.post('/register', async(req,res) =>{
  
  let {username, email, password, password2, role} = req.body;
  // console.log(req.body)
  let error = [];

  if(role==null){
    role='user'
  }

  //Check required fields
  if ( !username || !email || !password || !password2 ) {
    error.push( { msg : 'Please fill in all fields' } );
  }

  //Check password match
  if ( password2 !== password ) {
    error.push( { msg : "Password does not match" } )
  }

  //Check password length
  if ( password.length < 6 ) {
    error.push( { msg : 'Password should be at least 6 characters' } );
  }

  if( error.length > 0) {
    // console.log(error)
    res.send(error)
  }else{
    // console.log('here')
    const queryFindByEmail = `SELECT * FROM mbsa_users WHERE email="${email}"`;

    // connection.query(queryFindByStudent_ID, (err,results)=>{
    //   if (err) throw err;
    //   if (results.length >=1) {
    //     error.push( { msg: "Student ID is already registered"} );
    //     res.send(error)
    //   }else{
        connection.query(queryFindByEmail, (err,results) =>{
          // console.log(results)
          if(results.length>=1){
            error.push( { msg: "Email already registered" } )
           return res.send(error)
          }else{
            bcrypt.genSalt(10, (err,salt) =>{
              bcrypt.hash(password,salt, (err,hash) =>{
                if (err) throw err;
                password = hash;
                const newUser = {
                  username : username.toLowerCase(),
                  email : email,
                  password : password,
                  role : role
                };

                const queryInsertNewUser = `INSERT INTO mbsa_users SET ?`;
                connection.query(
                  queryInsertNewUser,
                  newUser,
                  (err,results) =>{
                    if(err) console.log(err)
                    // console.log(results)
                    error.push( { msg: 'Success. You can log in now'})
                    res.send(error)
                  }
                )
              })
            })
          }
        })
      }
    })
  // }
// });

module.exports = router;
