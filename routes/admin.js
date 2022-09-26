var express = require("express");
var adminHelper = require("../helper/adminHelper");
var fs = require("fs");
var router = express.Router();

const verifySignedIn = (req, res, next) => {
  if (req.session.signedInAdmin) {
    next();
  } else {
    res.redirect("/admin/signin");
  }
};

/* GET admins listing. */
router.get("/", verifySignedIn, async function (req, res, next) {
  let administator = req.session.admin;

  products = await adminHelper.getAllProducts();
  headers = await adminHelper.getAllHeaders();
  videos = await adminHelper.getAllVideos();
  abouts = await adminHelper.getAllAbouts();
  gallerys = await adminHelper.getAllGallery();

  res.render("admin/home", {
    admin: true,
    products,
    headers,
    videos,
    abouts,
    gallerys,
    administator,
  });
});

router.get("/all-products", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllProducts().then((products) => {
    res.render("admin/all-products", { admin: true, products, administator });
  });
});

// router.get("/all-about", verifySignedIn, function (req, res) {
//   let administator = req.session.admin;
//   adminHelper.getAllAbout().then((about) => {
//     res.render("admin/all-about", { admin: true, about, administator });
//   });
// });

router.get("/signup", function (req, res) {
  if (req.session.signedInAdmin) {
    res.redirect("/admin");
  } else {
    res.render("admin/signup", {
      admin: true,
      signUpErr: req.session.signUpErr,
    });
  }
});

router.post("/signup", function (req, res) {
  adminHelper.doSignup(req.body).then((response) => {
    console.log(response);
    if (response.status == false) {
      req.session.signUpErr = "Invalid Admin Code";
      res.redirect("/admin/signup");
    } else {
      req.session.signedInAdmin = true;
      req.session.admin = response;
      res.redirect("/admin");
    }
  });
});

router.get("/signin", function (req, res) {
  if (req.session.signedInAdmin) {
    res.redirect("/admin");
  } else {
    res.render("admin/signin", {
      admin: true,
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  adminHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedInAdmin = true;
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/admin/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedInAdmin = false;
  req.session.admin = null;
  res.redirect("/admin");
});

router.get("/site-edit", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/site-edit", { admin: true, administator });
});

///----------PRODUCT-------------------------///
router.get("/add-product", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-product", { admin: true, administator });
});

router.post("/add-product", function (req, res) {
  adminHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/product-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-product");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-product/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let productId = req.params.id;
  let product = await adminHelper.getProductDetails(productId);
  console.log(product);
  res.render("admin/edit-product", { admin: true, product, administator });
});

router.post("/edit-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  adminHelper.updateProduct(productId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/product-images/" + productId + ".png");
      }
    }
    res.redirect("/admin/all-products");
  });
});

router.get("/delete-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  adminHelper.deleteProduct(productId).then((response) => {
    fs.unlinkSync("./public/images/product-images/" + productId + ".png");
    res.redirect("/admin/all-products");
  });
});

router.get("/delete-all-products", verifySignedIn, function (req, res) {
  adminHelper.deleteAllProducts().then(() => {
    res.redirect("/admin/all-products");
  });
});

///----------PRODUCT END-------------------------///

///----------HEADER-------------------------///

router.get("/all-headers", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllHeaders().then((headers) => {
    res.render("admin/all-headers", { admin: true, administator, headers });
  });
});

router.get("/add-header", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-header", { admin: true, administator });
});

router.post("/add-header", function (req, res) {
  adminHelper.addHeader(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/header-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-header");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-header/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let headerId = req.params.id;
  let header = await adminHelper.getHeaderDetails(headerId);
  console.log(header);
  res.render("admin/edit-header", { admin: true, header, administator });
});

router.post("/edit-header/:id", verifySignedIn, function (req, res) {
  let headerId = req.params.id;
  adminHelper.updateHeader(headerId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/header-images/" + headerId + ".png");
      }
    }
    res.redirect("/admin/all-headers");
  });
});

router.get("/delete-header/:id", verifySignedIn, function (req, res) {
  let headerId = req.params.id;
  adminHelper.deleteHeader(headerId).then((response) => {
    fs.unlinkSync("./public/images/header-images/" + headerId + ".png");
    res.redirect("/admin/all-headers");
  });
});

router.get("/delete-all-headers", verifySignedIn, function (req, res) {
  adminHelper.deleteAllHeaders().then(() => {
    res.redirect("/admin/all-headers");
  });
});

///----------ABOUT-------------------------///

router.get("/all-about", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllAbouts().then((abouts) => {
    res.render("admin/all-about", { admin: true, abouts, administator });
  });
});

router.get("/add-about", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-about", { admin: true, administator });
});

router.post("/add-about", function (req, res) {
  adminHelper.addAbout(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/about-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-about");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-about/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let aboutId = req.params.id;
  let abouts = await adminHelper.getAboutDetails(aboutId);
  console.log(abouts);
  res.render("admin/edit-about", { admin: true, abouts, administator });
});

router.post("/edit-about/:id", verifySignedIn, function (req, res) {
  let aboutId = req.params.id;
  adminHelper.updateAbout(aboutId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/about-images/" + aboutId + ".png");
      }
    }
    res.redirect("/admin/all-about");
  });
});

router.get("/delete-about/:id", verifySignedIn, function (req, res) {
  let aboutId = req.params.id;
  adminHelper.deleteAbout(aboutId).then((response) => {
    fs.unlinkSync("./public/images/about-images/" + aboutId + ".png");
    res.redirect("/admin/all-about");
  });
});

router.get("/delete-all-about", verifySignedIn, function (req, res) {
  adminHelper.deleteAllAbout().then(() => {
    res.redirect("/admin/all-about");
  });
});

///----------GALLERY-------------------------///

router.get("/all-gallery", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllGallery().then((gallerys) => {
    res.render("admin/all-gallery", { admin: true, gallerys, administator });
  });
});

router.get("/add-gallery", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-gallery", { admin: true, administator });
});

router.post("/add-gallery", function (req, res) {
  adminHelper.addGallery(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/gallery-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-gallery");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-gallery/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let galleryId = req.params.id;
  let gallerys = await adminHelper.getGalleryDetails(galleryId);
  console.log(gallerys);
  res.render("admin/edit-gallery", { admin: true, gallerys, administator });
});

router.post("/edit-gallery/:id", verifySignedIn, function (req, res) {
  let galleryId = req.params.id;
  adminHelper.updateGallery(galleryId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/gallery-images/" + galleryId + ".png");
      }
    }
    res.redirect("/admin/all-gallery");
  });
});

router.get("/delete-gallery/:id", verifySignedIn, function (req, res) {
  let galleryId = req.params.id;
  adminHelper.deleteGallery(galleryId).then((response) => {
    fs.unlinkSync("./public/images/gallery-images/" + galleryId + ".png");
    res.redirect("/admin/all-gallery");
  });
});

router.get("/delete-all-gallery", verifySignedIn, function (req, res) {
  adminHelper.deleteAllGallery().then(() => {
    res.redirect("/admin/all-gallery");
  });
});

///----------VIDEO-------------------------///

router.get("/all-videos", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllVideos().then((videos) => {
    res.render("admin/all-videos", { admin: true, administator, videos });
  });
});

router.get("/add-video", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-video", { admin: true, administator });
});

router.post("/add-video", verifySignedIn, function (req, res) {
  adminHelper.addVideo(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/header-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-video");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-video/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let videoId = req.params.id;
  let video = await adminHelper.getVideoDetails(videoId);
  console.log(video);
  res.render("admin/edit-video", { admin: true, video, administator });
});

router.post("/edit-video/:id", verifySignedIn, function (req, res) {
  let videoId = req.params.id;
  adminHelper.updateVideo(videoId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/header-images/" + videoId + ".png");
      }
    }
    res.redirect("/admin/all-videos");
  });
});

router.get("/delete-video/:id", verifySignedIn, function (req, res) {
  let videoId = req.params.id;
  adminHelper.deleteVideo(videoId).then((response) => {
    fs.unlinkSync("./public/images/header-images/" + videoId + ".png");
    res.redirect("/admin/all-videos");
  });
});

router.get("/delete-all-videos", verifySignedIn, function (req, res) {
  adminHelper.deleteAllVideos().then(() => {
    res.redirect("/admin/all-videos");
  });
});
///-------------VIDEO END-------------///

///-------------Contact-------------///

router.get("/all-contact", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllContact().then((contact) => {
    res.render("admin/all-contact", { admin: true, administator, contact });
  });
});

router.get("/delete-contact/:id", verifySignedIn, function (req, res) {
  let contactId = req.params.id;
  adminHelper.deleteContact(contactId).then((response) => {
    res.redirect("/admin/all-contact");
  });
});

router.get("/delete-all-contact", verifySignedIn, function (req, res) {
  adminHelper.deleteAllContact().then(() => {
    res.redirect("/admin/all-contact");
  });
});
///-------------Contact END-------------///

router.get("/all-users", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllUsers().then((users) => {
    res.render("admin/all-users", { admin: true, administator, users });
  });
});

router.get("/remove-user/:id", verifySignedIn, function (req, res) {
  let userId = req.params.id;
  adminHelper.removeUser(userId).then(() => {
    res.redirect("/admin/all-users");
  });
});

router.get("/remove-all-users", verifySignedIn, function (req, res) {
  adminHelper.removeAllUsers().then(() => {
    res.redirect("/admin/all-users");
  });
});

router.post("/search", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.searchProduct(req.body).then((response) => {
    res.render("admin/search-result", { admin: true, administator, response });
  });
});

module.exports = router;
const userHelper = require("../helper/userHelper");
