var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
//===============
//AUTH ROUTES
//===============

//Register form
router.get("/register",function(req,res){
    res.render("register");
});

//Handle signup
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//login form
router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",
        {successRedirect:"/campgrounds",failureRedirect:"/login"})
        ,function(req,res){
    
});

router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","Logged You out!");
   res.redirect("/campgrounds");
});

router.get("/",function(req,res){
   res.render("landing");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;