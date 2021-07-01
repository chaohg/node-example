const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', authenticate.verifyAdmin, function(req, res) {
  User.find({}, function(err, users){
    res.send(users);
  });
});

router.post('/signup', (req,res) => {
    User.register(
      new User({username: req.body.username}),
      req.body.password,
    (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
        } else {
          if(req.body.firstname) {
            user.firstname = req.body.firstname;
          }
          if(req.body.lastname) {
            user.lastname = req.body.lastname;
          }
          user.save(err => {
            if(err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return;
            }
          
            passport.authenticate('local')(req, res, () =>{
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!'})
            })
        });
      }}
    )
})

  router.post('/login', passport.authenticate('local'), (req, res) =>{
    const token = authenticate.getToken({_id: req.user._id});  //once verify login, it will assign a token
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});}) // the assigned token will be carried out here after login successfully

  router.get('/logout', (req, res, next) => {
    if(req.session) {
      req.session.destroy(); // remove the session
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }
});

module.exports = router;

