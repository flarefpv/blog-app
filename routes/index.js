const express = require('express'),
passport = require('passport')
const router = express.Router()
const User = require('../models/user')

//Route Route
router.get('/', (req, res) => {
    res.redirect('/posts')
})


//Auth Routes

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/posts', 
    failureRedirect: '/login'
}), (req, res) => {
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/posts')
})

module.exports = router