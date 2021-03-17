const express = require("express");
const index_controller = require("../controllers/index.controller");
const User = require("../models/user-model");
const mongoose = require("mongoose");
const multer = require("multer");
const passport = require("passport");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});
const upload = multer({ storage });

router.get("/", checkNotAuthentication, index_controller.doLogin);

router.post("/", passport.authenticate("local", {
  successRedirect: "/session",
  failureRedirect: "/",
  failureFlash: true,
})
);
router.get("/session", checkAuthentication, index_controller.getSessions);

router.post("/upload", checkAuthentication, upload.single("datafile"), index_controller.createSession);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/delete-session/:id", checkAuthentication, index_controller.deleteSession);

router.get('/view-users', checkAuthentication, index_controller.getUsers)

router.post('/create-user', index_controller.createUser)

router.get('/delete-user/:id', index_controller.deleteUser)

router.get('/view-session/:id', checkAuthentication, index_controller.viewSessionPage)

router.get('/edit-user/:id', checkAuthentication, index_controller.getOneUser)

router.post('/edit-user/:id', index_controller.editUser)

router.get('/get-session-data/:id', index_controller.getSessionData)

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function checkNotAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/session");
  }
  return next();
}
module.exports = router;
