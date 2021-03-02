const express = require('express');
const index_controller = require('../controllers/index.controller');
const User = require('../models/user-model')
const mongoose = require('mongoose')
const multer = require('multer')
const passport = require('passport');
const router = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const {originalname} = file;
        cb(null,originalname)
    }
})
const upload = multer({storage})

router.get('/', checknotAuthentication, (req, res) => {
    res.render('login')
});
router.post('/', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',

}))
router.get('/home', checkAuthentication, (req, res) => {
 console.log(req.session);
    res.render('index')
})
router.post('/home', upload.single('avatar'),(req, res) => {
index_controller.hello(req,res)
// res.redirect('/home')
})

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
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}
function checknotAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    return next()

}
module.exports = router;
