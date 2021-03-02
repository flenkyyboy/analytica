const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Data', Schema({
    _id: Schema.Types.ObjectId,
   data:{
       type:Array
   }
}));