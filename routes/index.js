const express=require('express')
const router=express.Router()
const{ensurAuth,ensureGuest}=require('../middleware/auth')

const Story=require('../models/Story')



//@desc login/landing page
//@route GET/
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login',
    })
})

//@desc Dashboard
//@route GET/Dashboard
router.get('/dashboard',ensurAuth,async (req,res)=>{
    try {
        const stories=await Story.find({user:req.user.id}).lean()
        // console.log(req.user);
    res.render('dashboard',{
        name:req.user.firstName,
        stories
    })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }




    
})












module.exports=router