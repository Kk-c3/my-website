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

function addPost(postData) {
  return new Promise((resolve, reject) => {
    if (!postData.published) {
      postData.published = false;
    } else {
      postData.published = true;
    }

    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const categoryPosts = posts.filter((post) => post.category === category);
    if (categoryPosts.length === 0) return reject("no results returned");
    resolve(categoryPosts);
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter((post) => new Date(post.postDate) >= new Date(minDateStr));
    if (filteredPosts.length === 0) return reject("no results returned");
    resolve(filteredPosts);
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    const post = posts.find((post) => post.id === id);
    if (!post) return reject("no result returned");
    resolve(post);
  });
}

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};
