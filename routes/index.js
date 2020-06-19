const { v4: uuidv4 } = require('uuid');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
var connStr = process.env.DATABASE_URL || 'postgres://qeynghjkzdrmps:3fc86ee2f47ee9881b8ecffb23e434ebc3c7566c62c3423306e929f9ba090433@ec2-54-225-205-79.compute-1.amazonaws.com:5432/dfuqjsprjfgfae';



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**Add a record to the table */
router.get('/add', async (req, res) => {

  console.log('connStr:' + connStr );

  try{
  const pool = new Pool({
    connectionString: connStr,
    ssl: {
      rejectUnauthorized: false
    }
  });


  const client = await pool.connect();
  const name = 'Emp02-MeetRes-' + Date.now();
  const extId = uuidv4();
  const startTime = new Date();
  const duration = 30;
  const locId = '1313h000000Lbt9AAC';

  const results = await client.query("INSERT INTO salesforce.ContactEncounter(name,starttime,encounterduration,external_id__c,locationid) Values($1,$2,$3,$4,$5)",
  [name, startTime, duration, extId, locId]);
  client.release();  

  res.render('add', { title: 'Processing IoT Device Data...', res: results });
}
catch(err){
    console.log(err);
    res.send("Error " + err);
  }
});

module.exports = router;
