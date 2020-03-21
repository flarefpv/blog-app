const express = require('express'),
passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const flash = require('connect-flash')

//Route Route
router.get('/', (req, res) => {
    res.render('landing')
})


//Auth Routes

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    let newUsername = new User({username: req.body.username})
    User.register(newUsername, req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message)
            console.log(err)
            return res.redirect('back')
        }
        req.flash('success', 'You have been registered! Welcome ' + req.body.username + '!')
        passport.authenticate('local')(req, res, function(){
            res.redirect('/posts')
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), (req, res) => {
    req.flash('success', 'Welcome back ' + req.body.username + '!')
    res.redirect('/posts')
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You have been logged out.')
    res.redirect('/')
})

module.exports = router