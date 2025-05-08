require('dotenv').config()
const bcrypt = require('bcryptjs');
const pool = require('../models/pool')
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { updateMember } = require('../models/authModel')

const signUp_get = (req, res) => {
    res.render('sign-up', { errors: [], user: {} });
}

const signUp_post = async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;
    const isAdmin = req.body.isAdmin == 'yes'
    console.log('ADMIN: '+isAdmin)

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.render('sign-up', { errors: errors.array(), user: req.body });
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await pool.query(`
                INSERT INTO confessions_users (first_name, last_name, email, password, is_admin)
                VALUES ($1, $2, $3, $4, $5) ; 
                `, [firstName, lastName, email, hashedPassword, isAdmin])
        res.redirect('/sign-in')
    } catch (err) {
        console.log(err)
        res.send('Error Resgistering User...try again <a href="/sign-up">Sign Up</a>')
    }
}

const signIn_get = (req, res) => {
    res.render('../views/sign-in', { message: req.flash('error') })
}

const signIn_post = passport.authenticate('local', {
    failureRedirect: '/sign-in',
    successRedirect: '/',
    failureFlash: true
});

const logout = (req, res) => {
    req.logOut(() => {
        res.redirect('/')
    })
}

const member_login_get = (req, res) => {
    const isAuth = req.isAuthenticated()
    res.render('../views/member-login', { isAuth: isAuth, errors: null })
}

const member_login_post = async (req, res) => {
    const error = validationResult(req);
    const isAuth = req.isAuthenticated()
    if (!error.isEmpty() || !isAuth) {
        res.render('../views/member-login', { isAuth: isAuth, errors: error.errors[0] })
        return;
    }
    try {
        await updateMember(req.user.id, true)
        res.redirect('/posts')
    } catch (err) {
        console.log('Error updating is_member: ' + err)
    }
}


module.exports = {
    signUp_get,
    signUp_post,
    signIn_get,
    signIn_post,
    member_login_get,
    member_login_post,
    logout
}