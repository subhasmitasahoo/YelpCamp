var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    var id = req.params.id;
    Campground.findById(id,function(err,cg){
        if(err){
           res.send("Not found");
       }else{
          res.render("comments/new",{cg:cg});  
       }
    });
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    var id = req.params.id;
    Campground.findById(id,function(err,cg){
        if(err){
           console.log("Error: "+err);
       }else{
           Comment.create(req.body.comment,function(err,newComment){
               if(err){
                  console.log("Error: "+err);
              }else{
                  newComment.author.id = req.user._id;
                  newComment.author.username = req.user.username;
                  newComment.save(function(err, nc){
                      if(err){
                          console.log("Error: "+err);
                      }else{
                           cg.comments.push(nc);
                           console.log("NC....."+nc);
                          cg.save(function(err, cg){
                              if(err){
                                  console.log("Error: "+err);
                              }else{
                                  req.flash("success","Successfully added your comment");
                                  res.redirect("/campgrounds/"+id);
                              }
                          });
                      }
                  });
                 
              }
           });
          
    }
    });
});

router.get("/campgrounds/:id/comments/:cid/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,cg){
       if(err){
           res.redirect("/campgrounds");
       }else{
           Comment.findById(req.params.cid,function(err,comment){
               if(err){
                   res.redirect("/campgrounds");
               }else{
                   res.render("comments/edit",{cg:cg,comment:comment});
               }
           })
       }
    });
    
});

router.put("/campgrounds/:id/comments/:cid",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err, newComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

router.delete("/campgrounds/:id/comments/:cid",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.cid,function(err){
       if(err){
           res.redirect("back");
       }else{
           req.flash("success","Successfully deleted!");
           res.redirect("/campgrounds/"+req.params.id);
       } 
    });
});

module.exports = router;
