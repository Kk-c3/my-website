// /*********************************************************************************
//  *  WEB322 – Assignment 02
//  *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
//  *  (including 3rd party web sites) or distributed to other students.
//  *
//  *  Name: __Kranti K C__ Student ID: _146277215___ Date: _____2023/02/17___________
//  *
//  *  Online (Cyclic) Link: https://prickly-crow-pinafore.cyclic.app
//  *
//  ********************************************************************************/


var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
const blogService = require("./blog-service.js");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

var HTTP_PORT = process.env.PORT || 8080;

//config:

cloudinary.config({
  cloud_name: 'dxxq5xxg8',
  api_key: '657455241634879',
  api_secret: 't8GQLv-q0iRIUKWsWg5yl3Taqmo',
  secure: true
});

//multer
const upload = multer(); // no { storage: storage } since we are not using disk storage


// call this function after the http server starts listening for requests
function onHttpStart() {

console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
res.sendFile(path.join(__dirname, "/views/about.html"));
});
// new route to listen on /posts/add
app.get("/posts/add", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

// route to add a new blog post
app.post("/posts/add", upload.single("featureImage"), function(req, res) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    // add the new post
    blogService.addPost({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      published: req.body.published,
      featureImage: uploaded.url,
      date: new Date()
    }).then(() => {
      res.redirect("/posts");
    }).catch((err) => {
      res.status(500).json({ message: err });
    });
  }).catch((err) => {
    res.status(500).json({ message: err });         
      
  });
});

app.get("/blog", (req, res) => {
  blogService
  .getPublishedPosts()
  .then((data) => res.json(data))
  .catch((err) => res.status(500).json({ message: err }));
  });
  
  app.get("/posts", (req, res) => {
    if (req.query.category) {
      blogService
        .getPostsByCategory(req.query.category)
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json({ message: err }));
    } else if (req.query.minDate) {
      blogService
        .getPostsByMinDate(req.query.minDate)
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json({ message: err }));
    } else {
      blogService
        .getAllPosts()
        .then((data) => res.json(data))
        .catch((err) => res.status(500).json({ message: err }));
    }
  });
  
  app.get("/post/:id", (req, res) => {//new route
    const postId = parseInt(req.params.id);
    blogService
      .getPostById(postId)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ message: err }));
  });
  
  app.get("/categories", (req, res) => {
  blogService
  .getCategories()
  .then((data) => res.json(data))
  .catch((err) => res.status(500).json({ message: err }));
  });
  
  app.use(function(req, res) {
  res.status(404).send("Page Not Found");
  });
  
  app.listen(HTTP_PORT, onHttpStart, blogService.initialize);
  
  
  
  
  
