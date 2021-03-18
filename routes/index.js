const express = require("express");
const index_controller = require("../controllers/index.controller");
const user_controller = require("../controllers/user.controller");
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

router.get("/", checkNotAuthentication, user_controller.doLogin);

router.post("/", passport.authenticate("local", {
  successRedirect: "/session",
  failureRedirect: "/",
  failureFlash: true,
})
);
router.get("/session", checkAuthentication,checkSuperAdmin, index_controller.getSessions);

router.post("/upload", checkAuthentication,checkEmployee, upload.single("datafile"), index_controller.createSession);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/delete-session/:id", checkAuthentication,checkEmployee, index_controller.deleteSession);

router.get('/view-users', checkAuthentication,checkEmployee, user_controller.getUsers)

router.post('/create-user',checkEmployee, user_controller.createUser)

router.get('/delete-user/:id',checkEmployee, user_controller.deleteUser)

router.get('/view-session/:id', checkAuthentication, index_controller.viewSessionPage)

router.get('/edit-user/:id', checkAuthentication,checkEmployee, user_controller.getOneUser)

router.post('/edit-user/:id',checkEmployee, user_controller.editUser)

router.get('/get-session-data/:id', index_controller.getSessionData)

router.get('/allSession',index_controller.viewAllSesions)

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
function checkEmployee(req,res,next){
if(req.session.passport.user.role==='employee'){
  res.redirect('/session')
}else{
  next()
}
}
function checkSuperAdmin(req,res,next){
  if(req.session.passport.user.role==='super-admin'){
    res.redirect('/allSession')
  }else{
    next()
  }
}
module.exports = router;
