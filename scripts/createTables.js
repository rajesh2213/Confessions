const { Client } = require('pg')
require('dotenv').config()
const client = new Client({
    connectionString:process.env.EXT_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

const SQL = `
    DROP TABLE IF EXISTS confessions_messages;
    DROP TABLE IF EXISTS confessions_users; 
    DROP TABLE IF EXISTS confessions_user_sessions;
    
    CREATE TABLE confessions_users(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_member BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE confessions_messages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        author_id INTEGER REFERENCES confessions_users(id) ON DELETE CASCADE
    );

`

const createTable = async ()=>{
    try{
        await client.connect()
        await client.query(SQL)
        console.log('users, messages tables  created successfully');
    }catch(err){
        console.log('Error creating table: '+err)
    }finally{
        await client.end()
    }
}
createTable();