const csv = require('csvtojson')
const csvFilePath = './public/products.csv'

const helper = {}

exports.hello = function (req, res) {
    
    csv({ checkType: true }).fromFile(csvFilePath).then((jsonObj) => {

        const result = jsonObj.reduce((accumulator, currentValue)=> {
            var key = currentValue['Product ID']
            
            if(!helper[key]) {    
              helper[key] = currentValue
              accumulator.push(helper[key]);
            } else {
              helper[key].Quantity = helper[key].Quantity+currentValue.Quantity;
              
            }
          
            return accumulator;
          }, []);
        
          const totalproductvalue = result.map(item => ({
            ...item,
            'Total Price': item['Price'] * item['Quantity'],
        
        }))
        res.send(totalproductvalue)
    })

}