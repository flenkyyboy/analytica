
module.exports = {

    validateProperty:(jsonObj) => {
        jsonObj.forEach(item => {
            if (!item["Product ID"] && !item["Product Name"] && !item.Price && !item.Quantity) {
                throw err
            }
        })
    },
    addProduct:(jsonObj) => {
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

    },
    addTotalPrice:(result)=>{
        const totalproductvalue = result.map(item => ({
            ...item,
            'Total Price': item['Price'] * item['Quantity'],
        }))
        return totalproductvalue
    }

}

