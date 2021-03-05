const csv = require('csvtojson')
// const csvFilePath = './public/products.csv'
const Data = require('../models/data-model')
const Sessions = require('../models/session-model')
const mongoose = require('mongoose')
const fs = require('fs')

exports.hello = async function (req, res) {
    try {
        const helper = {}
        const jsonObj = await csv({ checkType: true }).fromFile(req.file.path);
        jsonObj.forEach(item => {
            if (!item["Product ID"]) {
                throw err
            }
            if (!item["Product Name"]) {
                throw err
            }
            if (!item.Price) {
                throw err
            }
            if (!item.Quantity) {
                throw err
            }
        })
        const result = jsonObj.reduce((accumulator, currentValue) => {
            var key = currentValue['Product ID']
            if (!helper[key]) {
                helper[key] = currentValue
                accumulator.push(helper[key]);
            } else {
                helper[key].Quantity = helper[key].Quantity + currentValue.Quantity;
            }
            return accumulator;
        }, []);
        const totalproductvalue = result.map(item => ({
            ...item,
            'Total Price': item['Price'] * item['Quantity'],
        }))
        if (totalproductvalue.length === 0) {
            fs.unlinkSync(req.file.path)
            res.render('sessions', { failed: 'File Uploaded Failed' })
        } else {
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
        }
    } catch (err) {
        fs.unlinkSync(req.file.path)
        res.render('sessions', { failed: 'Converting Failed' })
    }

}