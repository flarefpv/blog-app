const express = require('express')
const router = express.Router({mergeParams: true})
const Blog = require('../models/blog'),
Comment = require('../models/comment')
const middleware = require('../middleware')
const flash = require('connect-flash')

//Shows comments page if authenticated
router.get('/', middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err){
            console.log(err)
        } else{
            res.render('comments', {blog: foundBlog, comments: foundBlog.comments, author: foundBlog.author.username})
        }
    })
})

//Creates new comment
router.post('/', middleware.isLoggedIn, async function(req, res){
    let blog = await Blog.findById(req.params.id)
    req.body.commment = req.sanitize(req.body.comment)
    let comment = await Comment.create({
        author: req.user,
        text: req.body.comment.text
    })
    blog.comments.push(comment)
    blog.save()
    req.flash('success', 'Thanks for the commment :)')
    res.redirect('/posts/' + req.params.id + '/comments')
    })

//deletes comment if authorized
router.delete('/:commentId', (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err, foundComment) =>{
        if(err || req.user.username != foundComment.author.username){
            flash('error', "You don't have permission to do that.")
            res.redirect('/posts/' + req.params.id + '/comments')
        } else{
            req.flash('success', 'Your comment has been removed.')
            res.redirect('back')
        }
    })
})

module.exports = router