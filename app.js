const express = require('express'),
app = express(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override'),
passport = require('passport'),
localStrategy = require('passport-local'),
flash = require('connect-flash'),
dotenv = require('dotenv/config')

const port = process.env.PORT

//Requiring Routes
const indexRoutes = require('./routes/index'),
 blogRoutes = require('./routes/blogs'),
 commentRoutes = require('./routes/comments')

//Schemas
const Blog = require('./models/blog'),
Comment = require('./models/comment'),
User = require('./models/user')
seedDB = require('./seed')

//Setup
mongoose.connect(process.env.DB_CONNECT, { 
    useNewUrlParser: true, 
    useUnifiedTopology: false, 
    useFindAndModify: false 
}).then(() => {
    console.log('Connected to db')
}).catch(err => {
    console.log('ERROR' + err)
})

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))
app.use(flash())

//Deletes all db entries and seeds
// seedDB()

app.use(require('express-session')({
    secret: process.env.SECRET_MESSAGE,
    resave: false,
    saveUninitialized: false
}))

//Passport Setup
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

//Routing
app.use('/', indexRoutes)
app.use('/posts', blogRoutes)
app.use('/posts/:id/comments', commentRoutes)

//Server
app.listen(port, function(){
    console.log('Server is listening on PORT ' + port)
})