const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "User",
  Schema({
    _id: Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    // admin_id: {
    //     required: true,
    //     type: Schema.Types.ObjectId
    // }
  })
);
