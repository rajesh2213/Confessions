require('dotenv').config();

const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.EXT_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

async function seed() {
    try {
        await client.connect()

        await client.query(`
            TRUNCATE TABLE confessions_users, confessions_messages RESTART IDENTITY CASCADE;
            `)    
        console.log('Tables have been Truncated')

    } catch (err) {
        console.error('Error seeding database', err)
    } finally {
        await client.end()
    }
}
seed()
