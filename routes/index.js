var express = require('express');
var validator = require("email-validator");
var router = express.Router();
var path = require('path');
var fs = require('fs-extra');
var RateLimit = require('express-rate-limit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var signupLimiter = new RateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 100, // limit
    delayMs: 0 // flood delay, disabled
});
router.post('/signup', signupLimiter, function(req, res, next) {

  var email = req.body.email;
  var d = new Date();

  if (validator.validate(email)) {

    var data =  d.toISOString()+"\t"+email+"\r\n";
    fs.appendFile(path.join(__dirname,'..','data','leads.csv'), data, 'utf8', function(err){
      if (err) {
        res.send({ status:'ERROR', data: err, message: 'Unexpected error occurred, please try again later.' });
      } else {
        res.send({ status:'OK' });
      }
    });
  } else {
    res.send({ status:'ERROR', message: 'Incorrect email.' });
  }

});

module.exports = router;
