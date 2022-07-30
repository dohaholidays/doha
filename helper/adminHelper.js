var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");

module.exports = {
  addProduct: (product, callback) => {
    console.log(product);
    product.Price = parseInt(product.Price);
    db.get()
      .collection(collections.PRODUCTS_COLLECTION)
      .insertOne(product)
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


/// -----------HEADER SESSION --------------///
  addHeader: (header, callback) => {
    console.log(header);
    db.get()
      .collection(collections.HEADERS_COLLECTION)
      .insertOne(header)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
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

  getHeaderDetails: (headerId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.HEADERS_COLLECTION)
        .findOne({ _id: objectId(headerId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteHeader: (headerId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.HEADERS_COLLECTION)
        .removeOne({ _id: objectId(headerId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateHeader: (headerId, HeaderDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.HEADERS_COLLECTION)
        .updateOne(
          { _id: objectId(headerId) },
          {
            $set: {
              Name: HeaderDetails.Name,
              Description: HeaderDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  
  deleteAllHeaders: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.HEADERS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },
/// -----------HEADER END --------------///


/// -----------VIDEO SESSION --------------///

  addVideo: (video, callback) => {
    console.log(video);
    db.get()
      .collection(collections.VIDEOS_COLLECTION)
      .insertOne(video)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
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

  getVideoDetails: (videoId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.VIDEOS_COLLECTION)
        .findOne({ _id: objectId(videoId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteVideo: (videoId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.VIDEOS_COLLECTION)
        .removeOne({ _id: objectId(videoId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateVideo: (videoId, VideoDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.VIDEOS_COLLECTION)
        .updateOne(
          { _id: objectId(videoId) },
          {
            $set: {
              Name: VideoDetails.Name,
              Description: VideoDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  
  deleteAllVideos: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.VIDEOS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },
/// -----------VIDEO END --------------///




/// -----------SignUp --------------///

  doSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      if (adminData.Code == "admin123") {
        adminData.Password = await bcrypt.hash(adminData.Password, 10);
        db.get()
          .collection(collections.ADMIN_COLLECTION)
          .insertOne(adminData)
          .then((data) => {
            resolve(data.ops[0]);
          });
      } else {
        resolve({ status: false });
      }
    });
  },

  doSignin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let admin = await db
        .get()
        .collection(collections.ADMIN_COLLECTION)
        .findOne({ Email: adminData.Email });
      if (admin) {
        bcrypt.compare(adminData.Password, admin.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.admin = admin;
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

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .removeOne({ _id: objectId(productId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              Name: productDetails.Name,
              Category: productDetails.Category,
              Price: productDetails.Price,
              Description: productDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  deleteAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },



  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },

  removeUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .removeOne({ _id: objectId(userId) })
        .then(() => {
          resolve();
        });
    });
  },

  removeAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .find()
        .toArray();
      resolve(orders);
    });
  },

  changeStatus: (status, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": status,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  cancelAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name : "text" }).then(async()=>{
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
        })

    });
  },
};

const objectId = require("mongodb").ObjectID;


