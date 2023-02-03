const fs = require("fs");

let posts = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) return reject("unable to read posts.json file");
      posts = JSON.parse(data);
      fs.readFile("./data/categories.json", "utf8", (err, data) => {
        if (err) return reject("unable to read categories.json file");
        categories = JSON.parse(data);
        resolve();
      });
    });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) return reject("no posts found");
    resolve(posts);
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published === true);
    if (publishedPosts.length === 0) return reject("no published posts found");
    resolve(publishedPosts);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) return reject("no categories found");
    resolve(categories);
  });
}

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
};
