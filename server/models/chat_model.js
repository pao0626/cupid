require('dotenv').config();
const {pool} = require('./mysqlcon');
const {HOST} = process.env;

const getCoversation = async (id) => {
	const conn = await pool.getConnection();

	try {
		const [matchPair] = await conn.query('SELECT * FROM match_pair WHERE userID = ? OR otherID = ?', [id,id]);
		
		let allChatsInfo;
		//no match
		if(matchPair.length === 0){
			allChatsInfo = [];
			return{allChatsInfo};
		}
		// clear the match info
		const chats = matchPair.map(mp => {
			if(id === mp.userID){
				return{
					id: mp.otherID,
					match_time: mp.match_time
				}
			}
			return{
					id: mp.userID,
					match_time: mp.match_time
				}
		})

		//take match pair info from user table
		const chatsID = chats.map(c => c.id)

		const [chatsInfo] = await conn.query('SELECT id, name, email, main_image, login_at FROM user WHERE id IN (?)', [chatsID]);
		 
		chatsInfo.map(
			ci => {
				ci.main_imageURL=HOST+`/api/assets/${ci.email}/${ci.main_image}`
			}
		);

		//合併具有相同鍵值object的兩個array
		allChatsInfo = [...chats.concat(chatsInfo)
			.reduce((m, o) => m.set(o.id, Object.assign(m.get(o.id) || {}, o)),
			new Map()
		).values()];

		return {allChatsInfo};	 
	} catch (error) {
		console.error(error.message);
		return {error: error.message};
	} finally {
		conn.release();
	}
};

const getMessage = async (id, pairID) => {
	const conn = await pool.getConnection();
	try {
		const [pairInfo] = await conn.query('SELECT id, name, email, main_image, login_at FROM user WHERE id = ?', [pairID]);
		const [matchTime] = await conn.query('SELECT match_time FROM match_pair WHERE (userID = ? AND otherID = ?) OR (userID = ? AND otherID = ?)', [id,pairID,pairID,id]);
		const [messageHistory] = await conn.query('SELECT * FROM message_record WHERE sender IN (?) ', [[pairID,id]]);
		
		pairInfo[0].main_imageURL=HOST+`/api/assets/${pairInfo[0].email}/${pairInfo[0].main_image}`
		pairInfo[0].match_time = matchTime[0].match_time;
		
		return {
			pairInfo: pairInfo,
			messageHistory: messageHistory
		};	 
	} catch (error) {
		console.error(error.message);
		return {error: error.message};
	} finally {
		conn.release();
	}
};

const saveMessage = async (sender, receiver, text) => {
	const conn = await pool.getConnection();

	try {
		await conn.query('START TRANSACTION');	

		const record = {
			sender: sender,
			receiver: receiver,
			text: text
		};

		const sendAt = new Date();

		record.create_time = sendAt;

		const queryStr = 'INSERT INTO message_record SET ?';
		const [result] = await conn.query(queryStr, record);

		await conn.query('COMMIT');
		return {result};	 
	} catch (error) {
		console.error(error.message);
		await conn.query('ROLLBACK');
		return {error: error.message};
	} finally {
		conn.release();
	}
};


module.exports = {
	getCoversation,
	getMessage,
	saveMessage
};