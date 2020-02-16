const express = require('express'),
app = express(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override'),
passport = require('passport'),
localStrategy = require('passport-local')


//Schemas
const Blog = require('./models/blog'),
Comment = require('./models/comment'),
User = require('./models/user')
seedDB = require('./seed')

//Setup
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost/myblog', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

//Deletes all db entries and seeds
seedDB();

app.use(require('express-session')({
    secret: 'blarfblargblah',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Index Routes
app.get('/', (req, res) => {
    res.redirect('/posts')
})

app.get('/posts', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log(err)
        } else{
            res.render('index', {blogs: blogs})
        }
    })
})

app.get('/posts/genre/:genre', (req, res) => {
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

app.get('/posts/new', (req, res) => {
    res.render('new')
})

app.post('/posts', (req, res) => {
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

app.get('/posts/:id', (req, res) => {
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

app.get('/posts/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/posts')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

app.put('/posts/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect('/posts')
        } else{
            res.redirect('/posts/' + req.params.id)
        }
    })
})

app.delete('/posts/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, deletedBlog) =>{
        if(err){
            res.redirect('/posts/' + req.params.id)
        } else{
            res.redirect('/posts')
        }
    })
})

//Comments Routes

app.get('/posts/:id/comments', isLoggedIn, (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err){
            console.log(err)
        } else{
            res.render('comments', {blog: foundBlog, comments: foundBlog.comments})
        }
    })
})

app.post('/posts/:id/comments', async function(req, res){
    let blog = await Blog.findById(req.params.id)
    req.body.commment = req.sanitize(req.body.comment)
    let comment = await Comment.create({
        author: req.body.comment.author,
        text: req.body.comment.text
    })
    console.log(comment)
    blog.comments.push(comment)
    blog.save()
    res.redirect('/posts/' + req.params.id + '/comments')
    })

//Auth Routes

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    let newUsername = new User({username: req.body.username})
    User.register(newUsername, req.body.password, (err, user) => {
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            console.log(user)
            res.redirect('/')
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/posts', 
    failureRedirect: '/login'
}), (req, res) => {
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/posts')
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

//Server
app.listen(3000, function(){
    console.log('Server is listening on PORT ' + 3000)
})