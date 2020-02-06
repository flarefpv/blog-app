const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title:  String,
    image: String,
    tagline: String,
    body:   String,
    genre: String,
    date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Blog', blogSchema)

