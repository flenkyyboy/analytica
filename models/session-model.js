const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Session', Schema({
    _id: Schema.Types.ObjectId,
    created_by: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date, default: Date.now
    },
    data: {
        type: Schema.Types.ObjectId,
        ref: 'Data'
    }
}));