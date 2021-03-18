const Sessions = require("../session-model");
const moment = require("moment");
module.exports.validateProperty = (jsonObj) => {
  jsonObj.forEach((item) => {
    if (
      !item["Product ID"] &&
      !item["Product Name"] &&
      !item.Price &&
      !item.Quantity
    ) {
      throw err;
    }
  });
};
// module.exports.addProduct = (jsonObj) => {
//    let helper = {};
//    const addedProduct =  jsonObj.reduce((accumulator, currentValue) => {
//     var key = currentValue["Product ID"];
//     if (!helper[key]) {
//       helper[key] = currentValue;
//       accumulator.push(helper[key]);
//     } else {
//       helper[key].Quantity = helper[key].Quantity + currentValue.Quantity;
//     }
//     return accumulator;
//   }, []);
//   return addedProduct
// };
module.exports.addTotalPrice = (result) => {
  return result.map((item) => ({
    ...item,
    "Total Price": item["Price"] * item["Quantity"],
  }));
};
module.exports.getSession = async (userId, pageNo = 0) => {
  const skipValue = pageNo * 5;
  const getSessions = await Sessions.find({ created_by: userId })
    .skip(skipValue)
    .limit(5)
    .sort("-created_at")
    .lean();
  const totalSession = await Sessions.find({ created_by: userId }).countDocuments();
  const allSession = getSessions.map((item) => ({
    _id: item._id,
    created_by: item.created_by,
    data: item.data,
    created_at: moment(item.created_at).format("L"),
  }));
  return { allSession, totalSession };
};
module.exports.viewAllSession = async(pageNo = 0) => {
  const skipValue = pageNo * 5;
  const getSessions = await Sessions.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "created_by",
        foreignField: "_id",
        as: "user_info"
      }
    }
  ]).sort("-created_at").skip(skipValue).limit(5)
  const totalSession = await Sessions.countDocuments();
  const allSession = getSessions.map((item) => ({
    _id: item._id,
    created_by: item.created_by,
    data: item.data,
    created_at: moment(item.created_at).format("L"),
    user_info:item.user_info[0]
  }));
  return {allSession,totalSession}
}