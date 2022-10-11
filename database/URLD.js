const mongoose = require('mongoose')
const Schema = mongoose.Schema

const URLD = new Schema({
    original_url: String,
    short_url: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
})

module.exports = URLD
