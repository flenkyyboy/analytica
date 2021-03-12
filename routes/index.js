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

router.get("/", checkNotAuthentication, (req, res) => {
  res.render("login");
});
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/session",
    failureRedirect: "/",
    failureFlash: true,
  })
);
router.get("/session", checkAuthentication, (req, res) => {
  index_controller.getSessions(req, res);
});
router.post(
  "/upload",
  checkAuthentication,
  upload.single("datafile"),
  (req, res) => {
    index_controller.createSession(req, res);
  }
);

// router.post('/adduser',(req,res)=>{
//     console.log(req.body);
//     const userObj = {
//         "_id": new mongoose.Types.ObjectId(),
//         "name":req.body.name,
//         "email":req.body.email,
//         "password":req.body.password,
//         "role":"admin",
//         // "admin_id":0
//     }
//     const newUser = new User(userObj)
//     newUser.save((err,user)=>{
//         if(err){
//             res.status(400).send(err)
//         }else{
//             res.status(200).json(user)
//         }
//     })
// })
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
router.get("/delete-session/:id", checkAuthentication, (req, res) => {
  index_controller.deleteSession(req, res);
});
router.get('/view-users', checkAuthentication, (req, res) => {
  index_controller.getUsers(req, res)
})
router.post('/create-user', async (req, res) => {
    index_controller.createUser(req, res)
})
router.get('/delete-user/:id', (req, res) => {
  index_controller.deleteUser(req, res)
})
router.get('/view-session', checkAuthentication, (req, res) => {
  res.render('view-session')
})
router.get('/edit-user/:id', checkAuthentication, (req, res) => {
  index_controller.getOneUser(req, res)
})
router.post('/edit-user/:id', (req, res) => {
  index_controller.editUser(req, res)
})
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
