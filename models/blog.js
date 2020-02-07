const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Comment = require('./comment')

const blogSchema = new Schema({
    title:  String,
    image: String,
    body:   String,
    genre: {type: String, default: 'other'},
    date: { type: Date, default: Date.now },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports = mongoose.model('Blog', blogSchema)