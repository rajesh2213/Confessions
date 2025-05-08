require('dotenv').config()
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash');
const path = require('path')
const PgSession = require('connect-pg-simple')(session);
const pool = require('./models/pool')
const passport = require('passport');
require('./config/initializePassport')

const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'confessions_user_sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60 * 60 * 24 * 1000,
        sameSite: 'lax', //restricts cookie sharing
    } 
}))
app.use(flash());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRouter, indexRouter, postsRouter);
// app.use('/messages', messagesRouter);
app.listen(process.env.PORT, ()=>{
    console.log(`App is listening on Port ${process.env.PORT}`)
})