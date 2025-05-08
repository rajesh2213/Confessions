const pool = require('./pool')

async function updateMember(id, flag){
    try{
        await pool.query(`UPDATE confessions_users SET is_member = $2 WHERE id = $1`, [id, flag])
    }catch(err){
        console.log('Error updating is_member: '+err)
    }
}

module.exports = {
    updateMember
}