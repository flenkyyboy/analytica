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
        const totalProductValue = model_helper.addTotalPrice(result)
        const dataObj = {
            "_id": new mongoose.Types.ObjectId(),
            "data": totalProductValue
        }
        const newData = new Data(dataObj)
        newData.save(async (errr, data) => {
            const pageNo = req.query.page
            const userId = req.session.passport.user
            const { allSession, totalSession } = await model_helper.getSession(userId, pageNo)
            if (errr) {
                res.render('sessions', { failed: 'File Uploaded Failed', allSession, totalSession })
                fs.unlinkSync(req.file.path)
            } else {
                const sessObj = {
                    "_id": new mongoose.Types.ObjectId(),
                    "created_by": req.session.passport.user,
                    "data": data._id
                }
                const newSess = new Sessions(sessObj)
                newSess.save(async (err, user) => {
                    const pageNo = req.query.page
                    const userId = req.session.passport.user
                    const { allSession, totalSession } = await model_helper.getSession(userId, pageNo)
                    if (err) {
                        res.render('sessions', { failed: 'File Uploaded Failed', allSession, totalSession })
                    } else {
                        res.render('sessions', { success: 'Session Created Successfully', allSession, totalSession })
                    }
                })
                fs.unlinkSync(req.file.path)
            }
        })
    } catch (err) {
        const pageNo = req.query.page
        const userId = req.session.passport.user
        const { allSession, totalSession } = await model_helper.getSession(userId, pageNo)
        fs.unlinkSync(req.file.path)
        res.render('sessions', { failed: 'Converting Failed', allSession, totalSession })
    }
}
module.exports.getSessions = async (req, res) => {
    const pageNo = req.query.page
    const userId = req.session.passport.user
    const { allSession, totalSession } = await model_helper.getSession(userId, pageNo)
    res.render('sessions', { allSession, totalSession })
}
module.exports.deleteSession = async (req, res) => {
    const sessionData = await Sessions.findOneAndDelete({ _id: req.params.id })
    Data.findByIdAndDelete({ _id: sessionData.data }, (err) => {
        if (err) console.log(err);
    })
    res.redirect('/session')
}
module.exports.viewSession = async (req, res) => {
    const data = await Data.findOne({ _id: req.params.id })
    res.send(data._id)
}
