var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;

module.exports = {
  addContact: (contact, callback) => {
    console.log(contact);

    db.get()
      .collection("contact")
      .insertOne(contact)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCTS_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  getAllHeaders: () => {
    return new Promise(async (resolve, reject) => {
      let headers = await db
        .get()
        .collection(collections.HEADERS_COLLECTION)
        .find()
        .toArray();
      resolve(headers);
    });
  },

  getAllVideos: () => {
    return new Promise(async (resolve, reject) => {
      let videos = await db
        .get()
        .collection(collections.VIDEOS_COLLECTION)
        .find()
        .toArray();
      resolve(videos);
    });
  },

  getAllAbouts: () => {
    return new Promise(async (resolve, reject) => {
      let abouts = await db
        .get()
        .collection(collections.ABOUT_COLLECTION)
        .find()
        .toArray();
      resolve(abouts);
    });
  },

  getAllGallery: () => {
    return new Promise(async (resolve, reject) => {
      let gallerys = await db
        .get()
        .collection(collections.GALLERY_COLLECTION)
        .find()
        .toArray();
      resolve(gallerys);
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      db.get()
        .collection(collections.USERS_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          resolve(data.ops[0]);
        });
    });
  },

  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" })
        .then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        });
    });
  },
};
