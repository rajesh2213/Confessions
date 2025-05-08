const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const pool = require('../models/pool')

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM confessions_users WHERE email = $1`, [email])
        if (rows.length === 0) {
            return done(null, false, { message: 'No user with that email' })
        }
        const user = rows[0]
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Password Incorrect' })
        }
    } catch (err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((async (id, done)=>{
    const {rows} = await pool.query(`SELECT * FROM confessions_users WHERE id = $1`, [id])
    return done(null, rows[0])
}))