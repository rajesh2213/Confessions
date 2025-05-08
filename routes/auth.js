require('dotenv').config()
const { Router } = require('express')
const router = Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/authController')


//Sign-up
router.get('/sign-up', authCtrl.signUp_get)
router.post('/sign-up', [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
], authCtrl.signUp_post)


//Sign-in
router.get('/sign-in', authCtrl.signIn_get)
router.post('/sign-in', authCtrl.signIn_post)


//member login
router.get('/member-login', authCtrl.member_login_get)
router.post('/member-login', [
    body('key').trim().notEmpty().withMessage(`Key can't be empty`)
    .custom((value) => {
        console.log('MEMBER URL: '+process.env.MEMBER_KEY)
        if (value !== process.env.MEMBER_KEY) {
            throw new Error('Key is incorrect')
        }
        return true
    })
], authCtrl.member_login_post)


//logout
router.get('/logout', authCtrl.logout)

module.exports = router