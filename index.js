const express = require('express')
const app = express()
const port = 7777
const cors = require('cors')
const moment = require('moment')
const connection = require("./config/database");
const passport = require( 'passport' );

 //Passport middleware
 app.use(passport.initialize());
 app.use(passport.session());
 passport.serializeUser(function (user, done) {
   done(null, user);
 });
 
 passport.deserializeUser(async function (user, done) {
   done(null, user);
 });

app.use(cors())
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ));

// // // // // //

app.get('/', (req, res) => {
  res.send(new Date().toLocaleTimeString())
})

app.get('/api/total', (req,res)=>{
  dat = [];
  var q = `select SUM(ec) as total from building_data WHERE YEAR(date)=YEAR(CURDATE())-1;`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      }
    if (row) {
      // console.log(row)
      dat=row[0]
    }
    res.send(dat)
  });

  }
)

app.get('/api/total/weekday', (req,res)=>{
  let dat;
  var q = `select SUM(ec) as total, DAYNAME(date) as day, WEEKDAY(date) as dayname, YEAR(date) as year, WEEK(date,5) - WEEK(DATE_SUB(date,INTERVAL DAYOFMONTH(date)-1 DAY),5) + 1 as week from building_data WHERE YEAR(date)=YEAR(CURDATE())-1  GROUP BY year,week, day ,dayname ORDER BY year,week, dayname;`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      }
    if (row) {
      // console.log(row)
      let dataWeek1=[0,0,0,0,0,0,0]
      let dataWeek2=[0,0,0,0,0,0,0]
      let dataWeek3=[0,0,0,0,0,0,0]
      let dataWeek4=[0,0,0,0,0,0,0]
      let dataWeek5=[0,0,0,0,0,0,0]
      let dataWeek6=[0,0,0,0,0,0,0]
      let dataWeek7=[0,0,0,0,0,0,0]

      for(let i =0; i<row.length;i++){
        if(row[i].week == '1'){
          dataWeek1[row[i].dayname] = row[i].total
        }
        if(row[i].week == '2'){
          dataWeek2[row[i].dayname] = row[i].total
        }
        if(row[i].week == '3'){
          dataWeek3[row[i].dayname] = row[i].total
        }
        if(row[i].week == '4'){
          dataWeek4[row[i].dayname] = row[i].total
        }
        if(row[i].week == '5'){
          dataWeek5[row[i].dayname] = row[i].total
        }
        if(row[i].week == '6'){
          dataWeek6[row[i].dayname] = row[i].total
        }
        if(row[i].week == '7'){
          dataWeek7[row[i].dayname] = row[i].total
        }
        }
      dat={
        dataWeek1,
        dataWeek2,
        dataWeek3,
        dataWeek4,
        dataWeek5,
        dataWeek6,
        dataWeek7
      }
      res.send(dat)
    }
   })
    });

app.get('/api/total/month', (req,res)=>{
  dat = {};
  var q = `select SUM(ec) as total, YEAR(date) as year, DATE_FORMAT(date,'%b') as month from building_data WHERE YEAR(date)=YEAR(CURDATE())-1  GROUP BY YEAR(date), MONTH(date) ORDER BY YEAR(date),MONTH(date);`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      }
    if (row) {
      let totalArray=[]
      let monthArray=[]
      for(let i =0; i<row.length; i++){
        totalArray.push(row[i].total)
        monthArray.push(row[i].month)
      }
      dat={
        total:totalArray,
        month:monthArray
      }
      res.send(dat)
    }
    });
  }
)
app.get('/api/total/latest', (req,res)=>{
  dat = {};
  var q = `WITH ranked_messages AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY building_id ORDER BY YEAR(date)DESC, DAYOFYEAR(date) DESC, timestamp) AS rn FROM building_data AS m) SELECT * FROM ranked_messages WHERE rn=1;;`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      }
    if (row) {
      res.send(row)
    }
    });
  }
)
app.get('/api/total/latestMBSA', (req,res)=>{
  dat = {};
  var q = `SELECT SUM(ec) as total,date, building_id FROM building_data WHERE building_id=1 GROUP BY YEAR(date), DAYOFYEAR(date) ORDER BY YEAR(date) DESC, DAYOFYEAR(date) DESC LIMIT 1;`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      }
    if (row) {
      res.send(row)
    }
    });
  }
)


// API FOR USER/AUTH 
app.use("/api/auth", require("./routes/user/auth"))
app.use("/api/user", require("./routes/user/user"))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const mysqldump = require('mysqldump')

app.post("/copyTable", async (req,res)=>{
  console.log(req.body.table)
  const result = await mysqldump({
  //   connection: {
  // host: "zr.airmode.live",
  // user: "root",
  // password: "c1vG7R34",
  // database: "mbsa",
  // port: 3306,
  //   },
    connection: {
      host: "localhost",
      user: "root",
      password: "password",
      database: "mbsa",
    },
    dump:{
      tables:["mbsa_users"],
      // tables:[req.body.table],
      // tables:["users_nexplex_agriculture_mobile"],
      schema:{
        table: {
          ifNotExist: true,
          dropIfExist: true,
          charset: true,
        },
      }
    }
  });
  console.log(result)
res.send(result)
})

