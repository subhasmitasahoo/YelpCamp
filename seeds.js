var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
var data = [{
    name: "Solo trip",
    image: "https://farm5.staticflickr.com/4420/37403014592_c5f5d37906.jpg",
    desc: "Peaceful time",
    author: {
        id: 12345,
        author: "subhaTemp"
    }
},{name: "River and a boat",
    image: "https://farm5.staticflickr.com/4383/37386589826_0218e35baa.jpg",
    desc: "Best for fishing on Sunday",
    author: {
        id: 12346,
        author: "subhaTemp1"
    }
},{name: "BreathTaking",
    image: "https://farm6.staticflickr.com/5334/9925256586_c06d949b3e.jpg",
    desc: "Dreamland",
    author: {
        id: 12347,
        author: "subhaTemp2"
    }
}];

function seedDB(){
Campground.remove({},function(err){
   if(err){
       console.log("Error");
   } else{
       console.log("Campground Removed");
      data.forEach(function(seed){
      Campground.create(seed,function(err,data){
          if(err){
              console.log("Error: "+err);
          }else{
              console.log("Added: "+data.name);
          }
      }) ;
    });
   }
});

}

module.exports = seedDB;

