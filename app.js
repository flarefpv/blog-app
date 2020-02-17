const express = require('express'),
app = express(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override'),
passport = require('passport'),
localStrategy = require('passport-local')

const indexRoutes = require('./routes/index'),
 blogRoutes = require('./routes/blogs'),
 commentRoutes = require('./routes/comments')

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.use('/', indexRoutes)
app.use('/posts', blogRoutes)
app.use('/posts/:id/comments', commentRoutes)

//Server
app.listen(3000, function(){
    console.log('Server is listening on PORT ' + 3000)
})