require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');

const signUp = async (req, res) => {
	const {name, email, password } = req.body;

	if(!name || !email || !password) {
		res.status(400).send({error:'Request Error: name, email and password are required.'});
		return;
	}

	if (!validator.isEmail(email)) {
		res.status(400).send({error:'Request Error: Invalid email format'});
		return;
	}

	const result = await User.signUp(name, User.USER_ROLE.USER, email, password);
	if (result.error) {
		console.log(result.error);
		res.status(403).send({error: result.error});
		return;
	}

	const user = result.user;

	if (!user) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({
		data: {
			user: {
				name: user.name,
				role_id: user.role_id,
				email: user.email,
				password: user.password
			}
		}
	});
};

const setProfile = async (req, res) => {
	const data = req.body;
	const main_image = req.files.main_image[0].filename;

	if(!data.name || !data.gender || !data.pair || !data.email || !data.password) {
		res.status(400).send({error:'Request Error: name, gender, pair, email and password are required.'});
		return;
	}

	if (!validator.isEmail(data.email)) {
		res.status(400).send({error:'Request Error: Invalid email format'});
		return;
	}


	const result = await User.setProfile(data, main_image);
	if (result.error) {
		res.status(403).send({error: result.error});
		return;
	}

	const user = result.user;

	// if(req.files.other_images){
	//	 const images = req.files.other_images.map(
	//		 img => ([user.id, img.filename])
	//	 )
	//	 const result1 = await User.uploadImage(images);
	//	 if (result1.error) {
	//		 res.status(403).send({error: result.error});
	//		 return;
	//	 }
	// }

	if (!user) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({
		data: {
			access_token: user.access_token,
			login_at: user.login_at,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			}
		}
	});
};

const signIn = async (req, res) => {
	 const {email, password} = req.body;

	if(!email || !password){
		return {error: 'Request Error: email and password are required.', status: 400};
	}

	const result = await User.signIn(email, password);
	
	if (result.error) {
		res.status(400).send({error: result.error});
		return;
	}

	const user = result.user;
	if (!user) {
		res.status(500).send({error: 'Database Query Error'});
		return;
	}

	res.status(200).send({
		data: {
			access_token: user.access_token,
			login_at: user.login_at,
			user: {
				id: user.id,
				name: user.name,
				email: user.email
			}
		}
	});
};

const getUserProfile = async (req, res) => {
	delete req.user.password;
	delete req.user.access_token;
	res.status(200).send({
		data: req.user
	});
};

module.exports = {
	signUp,
	setProfile,
	signIn,
	getUserProfile
};