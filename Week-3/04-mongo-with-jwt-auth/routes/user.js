const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt=require("jsonwebtoken");
const jwtPassword=require("../jwtPass");
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username=req.headers.username;
    const password=req.headers.password;
    if(await User.findOne({username})){
        res.json({
            msg:"User already exists!"
        })
        return;
    }
    const token=jwt.sign({username},jwtPassword);
    await User.create({
        username,
        password
    })
    res.json({
        msg:"User created successfully!",
        token:"Bearer "+token
    })
});

router.post("/signin",async(req,res)=>{
    const username=req.headers.username;
    const password=req.headers.username;
    const user=await User.findOne({username,password});
    if(!user){
        res.json({
            msg:"User does not exist!"
        })
        return;
    }
    const token=jwt.sign({username},jwtPassword);
    res.json({
        msg:"User sign in successfully!",
        token:"Bearer "+token
    })
})

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourses=await Course.find({});
    res.json({
        courses:allCourses
    })
});

router.post('/courses/:id', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const id=req.params.id;
    try{
        await User.updateOne({username:req.headers.username},
            {"$push":{purchasedCourses:id}})
            res.json({
                msg:"Course purchased succesfully!"
            })
    }catch(e){
        console.log(e);
    }
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    console.log(req.headers.username);
    const user=await User.findOne({username:req.headers.username})
    const allCourses=await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })
    // $in is a MongoDB operator used to query documents where the value of a field equals any 
    // value in the specified array.
    // {"$in": user.purchasedCourses} is telling MongoDB to find documents where the _id field
    // matches any of the values in the user.purchasedCourses array.
    res.json({
        "Courses-purchased":allCourses
    })
});

module.exports = router