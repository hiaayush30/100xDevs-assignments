const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt=require("jsonwebtoken");
const jwtPassword=require("../jwtPass");
// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    if(await Admin.findOne({username:req.headers.username})){
        res.json({
            msg:"Admin already exists!"
        })
    }
    const token=jwt.sign({username:req.headers.username},jwtPassword);
    await Admin.create({
        username:req.headers.username,
        password:req.headers.password
    });
    res.json({
        msg:"Admin created successfully!",
        token:"Bearer "+token
    })
    // .catch(()=>{
    //     res.json({
    //         msg:"Admin not created!"
    //     })
    // })  //not needed as i have used await which will throw 500 if it does not work

});

router.post("/signin",async(req,res)=>{
    const username=req.headers.username;
    const password=req.headers.password;
    const admin=await Admin.findOne({username,password});
    if(!admin){
        res.json({
            msg:"Admin does not exist!"
        })
        return;
    }
    const token=jwt.sign({username},jwtPassword);
    res.json({
        msg:"Admin sign in successfully!",
        token:"Bearer "+token
    })
})

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    await Course.create({
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        imageLink:req.body.imageLink
    });
    res.json({
        msg:"Course added successfully!"
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses=await Course.find({});
    res.json({
        courses:allCourses
    })
});

module.exports = router;