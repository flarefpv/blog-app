const express = require('express'),
app = express(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override')

const Blog = require('./models/blog')
seedDB = require('./seed')


//Setup
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost/myblog', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


//Shemas


// Blog.create({
//     title: 'New Blog',
//     image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80',
//     tagline: 'These mountains are lit',
//     body: 'I really like mountains they are pretty to look at and shit',
// }, (err) => {
//     if (err){
//         console.log(err)
//     }
// })
seedDB();
//Routes
app.get('/', (req, res) => {
    res.redirect('/posts')
})

app.get('/posts', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log(err)
        } else{res.render('index', {blogs: blogs})}
    })
})

app.get('/posts/genre/:genre', (req, res) => {
    let blogGenre = req.params.genre
    Blog.find({genre: req.params.genre}, (err, foundBlogs) => {
        if(err){
            console.log(err)
        } else{res.render('genre', {blogs: foundBlogs, blogGenre: blogGenre})}
    })
})

app.get('/posts/new', (req, res) => {
    res.render('new')
})

app.post('/posts', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('new')
        } else{res.redirect('/posts')}
    })
})

app.get('/posts/:id', (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err){
            res.redirect('/')
        } else {res.render('show', {blog: foundBlog})}
    })
})

app.get('/posts/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/posts')
        } else {res.render('edit', {blog: foundBlog})}
    })
})

app.put('/posts/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect('/posts')
        } else{res.redirect('/posts/' + req.params.id)}
    })
})

app.delete('/posts/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, deletedBlog) =>{
        if(err){
            res.redirect('/posts/' + req.params.id)
        } else{res.redirect('/posts')}
    })
})

//Server
app.listen(3000, function(){
    console.log('Server is listening on PORT ' + 3000)
})