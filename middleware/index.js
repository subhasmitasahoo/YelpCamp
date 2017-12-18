var middlewareObject = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObject.checkCampgroundOwnership =  function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Campground not found");
            res.redirect("/campgrounds");
        }else{
            if(foundCamp.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error","You don't have permission to do that!");
                res.redirect("back");
            } 
        }
    });
   
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObject.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid,function(err,comment){
            if(err){
                res.redirect("/campgrounds");
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that!");
                    res.render("back");
                }
            }
        })
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.render("back")
    }
}


module.exports = middlewareObject;