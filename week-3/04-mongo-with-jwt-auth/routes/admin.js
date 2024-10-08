const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, User, Course } = require("../db");
const jwt=require('jsonwebtoken');
const {JWT_SECRET} = require("../config");
const router = Router();

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
     const username=req.body.username;
    const password=req.body.password;
    await Admin.create({
        username,
        password
    })
    res.json({
      message: "Admin created successfully",
    });
});

router.post('/signin', async(req, res) => {
    // Implement admin signin logic
     const username = req.body.username;
     const password = req.body.password;

     const user= await Admin.findOne({
        username:username,password:password
     })
     if(user){
          const token = jwt.sign({ username }, JWT_SECRET);
          res.json({
            token,
          });
     }else{
        res.status(411).json({
            msg:"incorrect email or password"
        })
     }
   
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;
  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });
  res.json({
    message: "Course created successfully",
    courseId: newCourse._id,
  });
});
router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
        const response = await Course.find({});

    res.json({
        courses: response
    })
});


module.exports = router;