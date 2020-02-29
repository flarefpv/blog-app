const express = require('express')
const router = express.Router({mergeParams: true})
const Blog = require('../models/blog'),
Comment = require('../models/comment')

//Shows comments page if authenticated
router.get('/', isLoggedIn, (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err){
            console.log(err)
        } else{
            res.render('comments', {blog: foundBlog, comments: foundBlog.comments, author: foundBlog.author.username})
        }
    })
})

//Creates new comment
router.post('/', async function(req, res){
    let blog = await Blog.findById(req.params.id)
    req.body.commment = req.sanitize(req.body.comment)
    let comment = await Comment.create({
        author: req.user,
        text: req.body.comment.text
    })
    blog.comments.push(comment)
    blog.save()
    res.redirect('/posts/' + req.params.id + '/comments')
    })

//Auth middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = router