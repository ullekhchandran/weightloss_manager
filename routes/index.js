var express = require('express');
var router = express.Router();

const User = require('../models/userModel');
const {validationResult}= require('express-validator')
const session= require('express-session')
const bcrypt=require('bcrypt');


const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userEmail) {
    return next();
  }
  res.redirect('/login');
};
/* GET home page. */


router.get('/',isAuthenticated, function(req, res, next) {
  const email = req.session.userEmail || null;
  res.render('weightAjax',{email:"email"});
  
});


router.get('/signup',(req,res)=>{
  res.render('signup',{message:null,error:null})
})

router.post('/signup',(req,res)=>{
  const {email,password,confirmPassword}=req.body;

  const user= new User({email,password})
  const validationError = user.validateSync();

  if(password !== confirmPassword){
    return res.render('signup',{message:'Password and confirm password do not match',error:null});
  };
  if(validationError){

    return res.render('signup',{message:null,error:validationError.errors});

  }

  User.findOne({email})
  .then(existingUser=>{
     
    if(existingUser){
      return res.render('signup',{message:'Email already taken', error:null});

    }else{
      return bcrypt.hash(password,10)
    }

  }).then(hashedPassword =>{

    const signupUser = new User({email, password:hashedPassword});
    return signupUser.save();
  }).then(()=>{
    res.redirect('/login');
  }).catch(error =>{
    console.error(error);
  });

});

router.get('/login',(req,res)=>{
  res.render('login',{message:null,errors:[]})
})

router.post('/login',(req,res)=>{

  const{email,password}= req.body;
  const user= new User({email,password})
  const validationError= user.validateSync();

  const errors= validationError||[];

  const validationResultErrors = validationResult(req);

  if(!validationResultErrors.isEmpty()){
    errors.push(...validationResultErrors.array())
  }
 
  if(errors.length>0){
    res.render('login',{errors,message:null})
  } else{
    const {email,password} =req.body;

    let foundUser;
    

    User.findOne({email})
    .then(user=>{
      console.log(user);
      if(!user){
        return res.render('login',{message:'Incorrect Email Address',errors:[]});

      }
      foundUser=user;
      return bcrypt.compare(password,foundUser.password)
    })
    .then(isPasswordValid=>{
      if(!isPasswordValid){
        return res.render('login',{message:'Incorrect password.',errors:[]});
      
      }
      req.session.userId = foundUser._id;
      req.session.userEmail =foundUser.email;
      
     return res.render('weightAjax',{email:foundUser.email});
      

    })
    .catch(error =>{
      console.error(error);
      res.status(500).send('Internal server Error')
    })
  }
  
});



router.get('/logout' ,(req,res)=>{
  req.session.destroy((err) =>{
    if (err){
      console.log(err);
      res.send('Error')
    }else{
      res.redirect('/login')
    }
  });
  });

  

module.exports = router;
