const {pool} = require('./mysqlcon');

const getCards = async (id, gender, pair ) => {
    const conn = await pool.getConnection();

    try {
        const [recordlist] = await pool.query('SELECT otherID FROM match_record WHERE userID = ?', [id]);
 
        const records = recordlist.map((i) => (i.otherID));

        const [cards] = await pool.query('SELECT id, name, text, email, main_image, login_at FROM user WHERE gender = ? AND pair  = ? AND id NOT IN (?)' , [pair, gender, records]);
        cards.map(
            card => {
                card.main_imageURL=`http://localhost:4000/assets/${card.email}/${card.main_image}`
            }
        );
        return {cards};   
    } catch (error) {
        console.error(error.message);
        return {error: error.message};
    } 
};

const recordCards = async (id, otherID, direction) => {
    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');    
        
        const record = {
            userID: id,
            otherID: otherID,
        };

        switch (direction) {
            case 'left':
                record.dislike = 1;
                record.like = 0;
                record.superlike = 0;
                break;
            case 'right': 
                record.dislike = 0;
                record.like = 1;
                record.superlike = 0;
                break;
            case 'up': 
                record.dislike = 0;
                record.like = 0;
                record.superlike = 1;
                break;
            default:
                record.dislike = 0;
                record.like = 0;
                record.superlike = 0;
        } 

        const queryStr = 'INSERT INTO match_record SET ?';
        const [result] = await conn.query(queryStr, record);

        await conn.query('COMMIT');
        return {result};   
    } catch (error) {
        console.error(error.message);
        await conn.query('ROLLBACK');
        return {error: error.message};
    } finally {
        await conn.release();
    }
};


module.exports = {
    getCards,
    recordCards
};