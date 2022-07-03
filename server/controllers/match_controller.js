const Match = require('../models/match_model');

const getCards = async (req, res) => {
	const {id, gender, pair} = req.user;

	const result = await Match.getCards(id, gender, pair);

	if (result.error) {
		res.status(403).send({error: result.error});
		return;
	}

	const cards = result.cards;

	if (!cards) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({cards});
};

const recordCards = async (req, res) => {
	const {id } = req.user;
	const {direction, otherID} = req.body;

	const result = await Match.recordCards(id, otherID, direction);

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

const isMatch = async (req, res) => {
	const {id } = req.user;
	const {otherID} = req.body;
	// judge whether girl like you too or not
	const canMatch = await Match.isMatch(id, otherID);

	if (canMatch.error) {
		res.status(403).send({error:canMatch.error});
		return;
	}

	if (!canMatch) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}
	//girl like you, match successed
	if (canMatch.match){
		const result = await Match.recordMatch(id, otherID);

		if (result.error) {
			res.status(403).send({error: result.error});
			return;
		}
		

		if (!result) {
			res.status(500).send({error: 'Database Query Error'});
			return;
		}

		res.status(200).send({canMatch});
		return;
	}	 

	res.status(200).send({canMatch});
};

module.exports = {
	getCards,
	recordCards,
	isMatch
};