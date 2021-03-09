const csv = require('csvtojson')
// const csvFilePath = './public/products.csv'
const Data = require('../models/data-model')
const Sessions = require('../models/session-model')
const mongoose = require('mongoose')
const fs = require('fs')
const model_helper = require('../models/helpers/index.helper')

module.exports.createSession = async (req, res) => {
    try {
        const jsonObj = await csv({ checkType: true }).fromFile(req.file.path);
        model_helper.validateProperty(jsonObj)
        const result = model_helper.addProduct(jsonObj)
        const totalproductvalue = model_helper.addTotalPrice(result)
        const dataObj = {
            "_id": new mongoose.Types.ObjectId(),
            "data": totalproductvalue
        }
        const newData = new Data(dataObj)
        newData.save((err, data) => {
            if (err) {
                res.render('sessions', { failed: 'File Uploaded Failed' })
                fs.unlinkSync(req.file.path)
            } else {
                const sessObj = {
                    "_id": new mongoose.Types.ObjectId(),
                    "created_by": req.session.passport.user,
                    "data": data._id
                }
                const newSess = new Sessions(sessObj)
                newSess.save(async (err, user) => {
                    const allSession = await model_helper.getSession(req, res)
                    if (err) {
                        res.render('sessions', { failed: 'File Uploaded Failed', allSession })
                    } else {
                        res.render('sessions', { succes: 'Session Created Succesfully', allSession })
                    }
                })
                fs.unlinkSync(req.file.path)
            }
        })
    } catch (err) {
        const allSession = await model_helper.getSession(req, res)
        fs.unlinkSync(req.file.path)
        res.render('sessions', { failed: 'Converting Failed', allSession })
    }

}
module.exports.getSessions = async (req, res) => {

    const allSession = await model_helper.getSession(req, res)
    res.render('sessions', { allSession })

}
module.exports.deleteSession = async (req, res) => {
 const sessionData =await Sessions.findOneAndDelete({_id:req.params.id})
 console.log(sessionData.data);
 Data.findByIdAndDelete({_id:sessionData.data},(err)=>{
    if(err) console.log(err);
 })
 res.redirect('/session')

}
