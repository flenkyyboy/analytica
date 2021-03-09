const Sessions = require('../session-model')
const moment = require('moment')
module.exports.validateProperty = (jsonObj) => {
    jsonObj.forEach(item => {
        if (!item["Product ID"] && !item["Product Name"] && !item.Price && !item.Quantity) {
            throw err
        }
    })
}
module.exports.addProduct = (jsonObj) => {
    const helper = {}
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
    return result

}
module.exports.addTotalPrice = (result) => {
    const totalproductvalue = result.map(item => ({
        ...item,
        'Total Price': item['Price'] * item['Quantity'],
    }))
    return totalproductvalue
}
module.exports.getSession = async (req,res)=>{
    const getSessions = await Sessions.find({ created_by: req.session.passport.user }).lean()
    const newSession = getSessions.map(item=>({
        _id:item._id,
        created_by:item.created_by,
        data:item.data,
        created_at: moment(item.created_at).format("MMM Do YY")
    
    
    }))
    return newSession
}


