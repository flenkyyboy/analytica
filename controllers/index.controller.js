const csv = require('csvtojson')
const csvFilePath = './public/products.csv'



exports.hello = async function (req, res) {

    try {
        const helper = {}
        const jsonObj = await csv().fromFile(csvFilePath);


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
        res.send(totalproductvalue)
    } catch (error) {
        console.log(error);
    }

}