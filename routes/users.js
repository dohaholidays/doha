var express = require("express");
var userHelper = require("../helper/userHelper");
var router = express.Router();

router.get("/form", async function (req, res) {
  res.render("users/form", {
    admin: false,
  });
});

router.post("/form", (req, res) => {
  console.log(req.body);
  userHelper.addContact(req.body, (result) => {
    res.redirect("/");
  });
});

const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if (user) {
    let userId = req.session.user._id;
    cartCount = await userHelper.getCartCount(userId);
  }

  products = await userHelper.getAllProducts();
  headers = await userHelper.getAllHeaders();
  videos = await userHelper.getAllVideos();
  abouts = await userHelper.getAllAbouts();
  gallerys = await userHelper.getAllGallery();

  res.render("users/home", {
    admin: false,
    products,
    headers,
    videos,
    user,
    abouts,
    gallerys,
  });
});

/*  SERVICE PAGE  */

router.get("/sportshub", async function (req, res) {
  res.render("services/sportshub", {
    admin: false,
  });
});

router.get("/travels", async function (req, res) {
  res.render("services/travels", {
    admin: false,
  });
});

router.get("/convention", async function (req, res) {
  res.render("services/convention", {
    admin: false,
  });
});

router.get("/trading", async function (req, res) {
  res.render("services/trading", {
    admin: false,
  });
});

router.get("/contracting", async function (req, res) {
  res.render("services/contracting", {
    admin: false,
  });
});

router.get("/booking", async function (req, res) {
  res.render("services/booking", {
    admin: false,
  });
});

router.get("/booking", async function (req, res) {
  res.render("services/booking", {
    admin: false,
  });
});

/*  SERVICE PAGE END */

//------------------------END-------------------///

router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", { admin: false });
  }
});

router.post("/signup", function (req, res) {
  userHelper.doSignup(req.body).then((response) => {
    req.session.signedIn = true;
    req.session.user = response;
    res.redirect("/");
  });
});

router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signin", {
      admin: false,
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedIn = false;
  req.session.user = null;
  res.redirect("/");
});

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  userHelper.searchProduct(req.body).then((response) => {
    res.render("users/search-result", {
      admin: false,
      user,
      cartCount,
      response,
    });
  });
});

module.exports = router;
