const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')


//Index routes
router.get('/', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log(err)
        } else{
            res.render('index', {blogs: blogs})
        }
    })
})

router.get('/genre/:genre', (req, res) => {
    let blogGenre = req.params.genre
    Blog.find({genre: req.params.genre}, (err, foundBlogs) => {
        if(err){
            console.log(err)
        } else{
            res.render('genre', {blogs: foundBlogs, blogGenre: blogGenre})
        }
    })
})

//Create Routes

router.get('/new', (req, res) => {
    res.render('new')
})

router.post('/', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('new')
        } else{
            res.redirect('/posts')
        }
    })
})

//Show Route

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err){
            console.log(err)
        } else if (req.isAuthenticated()){
            res.redirect('/posts/' + req.params.id + '/comments')
        } else {
            res.render('show', {blog: foundBlog, comments: foundBlog.comments})
        }
    })
})

//Update/Destroy Routes

router.get('/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/posts')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

router.put('/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect('/posts')
        } else{
            res.redirect('/posts/' + req.params.id)
        }
    })
})

router.delete('/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, deletedBlog) =>{
        if(err){
            res.redirect('/posts/' + req.params.id)
        } else{
            res.redirect('/posts')
        }
    })
})

module.exports = router