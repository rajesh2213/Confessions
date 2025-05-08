const { Router } = require('express')
const router = Router()
const postsCtrl = require('../controllers/postsController')
const { body } = require('express-validator')

router.use((req, res, next) => {
    res.locals.isAuth = req.isAuthenticated()
    next()
})
router.get('/posts', postsCtrl.fetchMessages, postsCtrl.posts_all_get)
router.post('/posts', [
    body('title').trim().notEmpty().withMessage(`Title can't be empty`),
    body('content').notEmpty().withMessage(`Content can't be empty`)
], postsCtrl.fetchMessages, postsCtrl.posts_post)

router.post('/posts/delete', postsCtrl.ensureAdmin, postsCtrl.delete_post)

module.exports = router