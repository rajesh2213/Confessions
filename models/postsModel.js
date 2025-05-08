const e = require('connect-flash')
const pool = require('./pool')


const getAllMessages = async () => {
    try{
        const {rows} = await pool.query(`
            SELECT  
                m.id,
                CONCAT(u.first_name, ' ', u.last_name) AS author,
                m.title,
                m.content,
                m.timestamp
            FROM confessions_messages m 
            JOIN confessions_users u ON u.id = m.author_id
            `)
        return rows
    }catch(err){
        console.log(`Error getting all messages: ${err}`)
    }    
}

const insertMessageById = async (userId, title, content) => {
    try{
        console.log('Insert req by author_id: '+userId)
        console.log('Insert req by author_id:', userId, typeof userId);
        const checkUser = await pool.query('SELECT * FROM confessions_users WHERE id = $1', [userId]);
        console.log('Check user exists:', checkUser.rows);

        await pool.query(`
            INSERT INTO confessions_messages (title, content, author_id)
            VALUES ($1, $2, $3)`, [title, content, userId])
    }catch(err){
        console.log(`Error inserting message: ${err}`)
    }
}

const deleteMessageById = async (msgId) => {
    try{
        await pool.query(`DELETE FROM confessions_messages WHERE id = $1`, [msgId])
    }catch(err){
        console.log(`Error deleting message: ${err}`)
    }
}

module.exports = {
    getAllMessages,
    insertMessageById,
    deleteMessageById
}