const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");
const mongoose = require('mongoose');
const contents = require(__dirname + "/pageContent.js")
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/postsDB');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = contents.home();
const aboutContent = contents.about();
const contactContent = contents.contact();

app.get("/", function (req, res) {

  Post.find({}, function (err, results) { 

    if(err){
      console.log(err);
    }
    else{
      res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: results
  });
    }
   });

});

app.get("/contact", function (req, res) {

  res.render("contact", {
    para3: contactContent
  });

});

app.get("/about", function (req, res) {

  res.render("about", {
    para2: aboutContent
  });

});

app.get("/compose", function (req, res) {

  res.render("compose", {
    
  });

});

app.get("/posts/:postName", function (req, res) {
  
  const reqTitle = _.lowerCase(req.params.postName);

  Post.find({}, function (err, results) { 
    if(!err){
      for(var i = 0; i<results.length; i++){
        var foundTitle = _.lowerCase(results[i].title);
        if(foundTitle === reqTitle){
          res.render("post", {
            title: results[i].title,
            content: results[i].body,
          });
          break;
        }
      }
    }
   });
 });

app.post("/compose", function (req, res) {

  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;
  const post = new Post({
    title: postTitle,
    body: postBody,
  });
  post.save();
  res.redirect("/");

 });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
