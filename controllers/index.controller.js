const csv = require('csvtojson')
// const csvFilePath = './public/products.csv'
const Data = require('../models/data-model')
const Sessions = require('../models/session-model')
const mongoose = require('mongoose')
const fs = require('fs')
const model_helper = require('../models/helpers/index.helper')
module.exports = {

    createSession: async (req, res) => {
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
                    newSess.save((err, user) => {
                        if (err) {
                            res.render('sessions', { failed: 'File Uploaded Failed' })
                        } else {
                            res.render('sessions', { succes: 'Session Created Succesfully' })
                        }
                    })
                    fs.unlinkSync(req.file.path)
                }
            })
        } catch (err) {
            fs.unlinkSync(req.file.path)
            res.render('sessions', { failed: 'Converting Failed' })
        }

    },
    getSessions:async(req,res)=>{

        const allSession = await Sessions.find({created_by:req.session.passport.user}).lean()
        res.render('sessions',{allSession})

    }
}