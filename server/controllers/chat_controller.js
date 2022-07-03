const Chat = require('../models/chat_model');

const getCoversation = async (req, res) => {
	const {id} = req.user;

	const result = await Chat.getCoversation(id);

	if (result.error) {
		res.status(403).send({error: result.error});
		return;
	}

	const allChatsInfo = result.allChatsInfo;

	if (!allChatsInfo) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({allChatsInfo});
};

const getMessage = async (req, res) => {
	const {id } = req.user;
	const pairID = req.query.id;

	const result = await Chat.getMessage(id, pairID);

	if (result.error) {
		res.status(403).send({error: result.error});
		return;
	}
	
	if (!result) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({result});
};

const saveMessage = async (req, res) => {
	const {id } = req.user;
	const {receiver, text} = req.body;

	if(!receiver || !text) {
		res.status(400).send({error:'Request Error: receiver and text are required.'});
		return;
	}

	const result = await Chat.saveMessage(id, receiver, text);

	if (result.error) {
		res.status(403).send({error: result.error});
		return;
	}

	if (!result) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({result});
};

module.exports = {
	getCoversation,
	getMessage,
	saveMessage
};