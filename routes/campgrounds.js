var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
    //get campgrounds from DB
    Campground.find({},function(err,campgrounds){
       if(err){
           console.log("Sometging bad happened");
       }
       else{
            res.render("campgrounds/index",{cg:campgrounds,curUser:req.user});
       }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
   var name = req.body.name;
   var price = req.body.price;
   var img = req.body.imageurl;
   var desc = req.body.desc;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newcg = {name:name,price:price,image:img,desc:desc,author:author};
   console.log("USER...... "+req.user);
   Campground.create(newcg,function(err,cg){
       if(err){
           console.log(err);
       }
       else{
           console.log(cg);
           res.redirect("/campgrounds");
       }
   });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

router.get("/:id",function(req,res){
    var id = req.params.id;
    console.log(id);
    Campground.findById(id).populate("comments").exec(function(err,found){
       if(err){
           res.send("Not found");
       }
       else{
           console.log("Found "+found);
           res.render("campgrounds/show",{cg:found});
       }
    });
    
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCamp){
            if(err)
                res.redirect("/campgrounds");
            else
                res.render("campgrounds/edit",{cg:foundCamp});
            
    });
});


router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,upCg){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          console.log("Error: "+err);
      } else{
          res.redirect("/campgrounds");
      }
   }); 
});


module.exports = router;