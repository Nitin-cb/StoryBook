const express=require('express')
const router=express.Router()
const{ensurAuth}=require('../middleware/auth')

const Story=require('../models/Story')



//@desc Show add page
//@route GET/stories/add
router.get('/add',ensurAuth,(req,res)=>{
    res.render('stories/add')
})

//@desc process the add form
//@route POST/stories
router.post('/',ensurAuth,async (req,res)=>{
    try {
        req.body.user=req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

//@desc Show all stories
//@route GET/stories
router.get('/',ensurAuth, async(req,res)=>{
    try {
        const stories=await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt:'desc'})
        .lean()

    res.render('stories/index',{
                stories,
    })
    } catch (err) {
        console.error(err);
        res.render('error/500')    }
})



//@desc Show single story
//@route GET/stories/:id
router.get('/:id',ensurAuth,async(req,res)=>{
    try {
        let story=await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story){
            return res.render('error/404')
        }
        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
          } else {
            res.render('stories/show', {
              story,
            })
          }
    } catch (error) {
        console.error(error)
        return res.render('error/404')
    }
})

//@desc show edit
//@route GET/stories/edit/:id
router.get('/edit/:id',ensurAuth, async(req,res)=>{
        try{
            const story=await Story.findOne({
                _id:req.params.id
            }).lean()
    
        if(!story){
            return res.render('error/404')
        }
    
        if(story.user!=req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story,
            })
        }
        }catch (error) {
        console.error(error);
        return res.render('error/500')
    }
})

//@desc Update story
//@route PUT/stories/:id
router.put('/:id',ensurAuth,async (req,res)=>{
    try{
        let story= await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }
    if(story.user!=req.user.id){
        res.redirect('/stories')
    }else{
        story=await Story.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true,
            runValidators:true,
        })
        res.redirect('/dashboard')
    }
    }catch (error) {
        console.error(error);
        return res.render('error/500')
    }
    
})


//@desc Delete story
//@route DELETE/stories/:id
router.delete('/:id',ensurAuth,async(req,res)=>{
    try {
        await Story.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        return res.render('error/500')
    }
})

// //@desc user stories
// //@route GET/stories/user/:userId
router.get('/user/:userId',ensurAuth,async(req,res)=>{
    try {
        const stories=await Story.find({
            user:req.params.userId,
            status:'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index',{
            stories,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')

    }
})

module.exports=router