const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
const middleware = require('../middleware')
const flash = require('connect-flash')

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

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('new')
})

router.post('/', middleware.isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    Blog.create(req.body.blog, (err, newBlog) => {
        newBlog.author = author
        newBlog.save()
        if(err){
            req.flash('error', 'Something went wrong! Please try again.')
            res.redirect('/new')
        } else{
            req.flash('success', 'Post has been created!')
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

router.get('/:id/edit', middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err || req.user.username != foundBlog.author.username){
            req.flash('error', "You don't have permission to do that.")
            res.redirect('/posts/' + req.params.id + '/comments')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

router.put('/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {
        if(err || req.user.username != foundBlog.author.username){
            req.flash('error', "You don't have permission to do that.")
            res.redirect('/posts/' + req.params.id + '/comments')
        } else{
            req.flash('success', 'Your post has been updated.')
            res.redirect('/posts/' + req.params.id + '/comments')
        }
    })
})

router.delete('/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, foundBlog) =>{
        if(err || req.user.username != foundBlog.author.username){
            req.flash('error', "You don't have permission to do that.")
            res.redirect('/posts/' + req.params.id + '/comments')
        } else{
            req.flash('success', 'Your post has been removed.')
            res.redirect('/posts')
        }
    })
})

module.exports = router