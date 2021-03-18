
const mongoose = require("mongoose");
const User = require('../models/user-model')


module.exports.createUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const allUser = await User.find({ admin_id: req.session.passport.user._id }).lean()
    if (user) {
      res.render('view-users', { failed: 'Email Already Exist', allUser,role: req.session.passport.user.role })
    } else {
      const userObj = {
        "_id": new mongoose.Types.ObjectId(),
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "role": req.session.passport.user.role === "admin" ? "employee" : "admin",
        "admin_id": req.session.passport.user._id
      }
      const newUser = new User(userObj)
      newUser.save(async (err, user) => {
        const allUser = await User.find({ admin_id: req.session.passport.user._id }).lean()
        if (err) {
          res.render('view-users', { failed: 'User not created', allUser ,role: req.session.passport.user.role})
        } else {
          res.render('view-users', { success: 'User Created Successfully', allUser,role: req.session.passport.user.role })
        }
      })
    }
  }
  module.exports.getUsers = async (req, res) => {
    const allUser = await User.find({ admin_id: req.session.passport.user._id }).lean()
    res.render('view-users', { allUser })
  }
  module.exports.deleteUser = async (req, res) => {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/view-users");
  };
  module.exports.getOneUser = (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (!err) {
        res.render('edit-user', { user })
      }
    }).lean();
  }
  module.exports.editUser = (req, res) => {
    const userObj = {
      "name": req.body.name,
      "email": req.body.email,
      "password": req.body.password,
    }
    User.findByIdAndUpdate(req.params.id, userObj, { new: true }).exec((err, doc) => {
      if (err) {
        res.redirect('/view-users')
      } else {
        res.redirect('/view-users')
      }
    })
  }
  module.exports.doLogin = (req, res) => {
    res.render("login");
  }