const { validationResult } = require('express-validator')
const pool = require('../models/pool')
const { getAllMessages, insertMessageById, deleteMessageById } = require('../models/postsModel')


const fetchMessages = async (req, res, next) => {
    try {
        const messages = await getAllMessages()
        res.locals.messages = messages
        next()
    } catch (err) {
        console.error('Error fetching messages:', err)
        res.status(500).send('Server error')
    }
}

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.is_admin) {
        return next()
    }
    res.status(403).send('Forbidden')
}


const posts_all_get = async (req, res) =>{
    res.render('../views/posts')
}

const posts_post = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty){
        return res.render('../views/posts', {errors: errors.array()})
    }
    const userId = req.user.id 
    const {title, content} = req.body
    try{
        await insertMessageById(userId, title, content)
        res.redirect('/posts')
    }catch(err){
        console.log(`Error creating a new post: ${err}`)
    }
}

const delete_post = async (req, res)=>{
    const { message_id } = req.body
    try {
        await deleteMessageById(message_id)
        res.redirect('/posts')
    } catch (err) {
        console.error('Error deleting post:', err)
        res.status(500).send('Server error')
    }
}

module.exports = {
    posts_all_get,
    posts_post,
    fetchMessages,
    delete_post,
    ensureAdmin
}