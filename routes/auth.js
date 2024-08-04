const express=require('express')
const passport = require('passport')
const { route } = require('.')
const router=express.Router()


//@desc Authenticate with google
//@route GET/auth/google
router.get('/google',passport.authenticate('google',{scope:['profile']}))

//@desc google auth call back
//@route GET/auth/google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect:
    '/'}),(req,res)=>{
        res.redirect('/dashboard')
    })


//@desc LOGOUT user
//@route /auth/logout

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });
  });


// router.get('/logout',(req,res)=>{
//     req.logout();
//     res.redirect('/')

// })










module.exports=router