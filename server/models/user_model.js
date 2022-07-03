require('dotenv').config();
const bcrypt = require('bcrypt');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {pool} = require('./mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);
const {TOKEN_SECRET} = process.env; 
const jwt = require('jsonwebtoken');

const USER_ROLE = {
	ALL: -1,
	PREMIUM: 1,
	USER: 2
};

const signUp = async (name, roleId, email, password ) => {
	const conn = await pool.getConnection();
	try {
		const emails = await conn.query('SELECT email FROM user WHERE email = ? FOR UPDATE', [email]);
		if (emails[0].length > 0){
			return {error: 'Email Already Exists'};
		}

		const user = {
			name: name,
			role_id: roleId,
			email: email,
			password: bcrypt.hashSync(password, salt),	 
		};
		return {user};
	} catch (error) {
		return {error: error.message};
	} finally {
		conn.release();
	}
};

const setProfile = async (data, main_image) => {
	const conn = await pool.getConnection();

	try {
		await conn.query('START TRANSACTION');

		const loginAt = new Date();
		
		const user = {
			name: data.name,
			role_id: data.role_id,
			gender: data.gender,
			pair : data.pair ,
			email: data.email,
			text: data.text,
			password: data.password,	 
			login_at: loginAt,
			main_image: main_image
		};
		const accessToken = jwt.sign({
			name: user.name,
			email: user.email
		}, TOKEN_SECRET);
		user.access_token = accessToken;

		const queryStr = 'INSERT INTO user SET ?';
		const [result] = await conn.query(queryStr, user);

		user.id = result.insertId;
		await conn.query('COMMIT');
		return {user};
	} catch (error) {
		await conn.query('ROLLBACK');
		return {error: error.message};
	} finally {
		conn.release();
	}
};

const uploadImage = async (images) => {
	const conn = await pool.getConnection();
	try {
		await conn.query('START TRANSACTION');
		await conn.query('INSERT INTO user_images(user_id, image) VALUES ?', [images]);
		await conn.query('COMMIT');
		return {data:"success"};
	} catch (error) {
		console.log(error);
		await conn.query('ROLLBACK');
		return {error};
	} finally {
		conn.release();
	}
};

const signIn = async (email, password) => {
	const conn = await pool.getConnection();
	try {
		await conn.query('START TRANSACTION');

		const [users] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
		const user = users[0];
		
		if (!bcrypt.compareSync(password, user.password)){
			await conn.query('COMMIT');
			return {error: 'Password is wrong'};
		}

		const loginAt = new Date();
		const accessToken = jwt.sign({
			name: user.name,
			email: user.email
		}, TOKEN_SECRET);

		const queryStr = 'UPDATE user SET access_token = ?, login_at = ? WHERE id = ?';
		await conn.query(queryStr, [accessToken, loginAt, user.id]);

		await conn.query('COMMIT');

		user.access_token = accessToken;
		user.login_at = loginAt;

		return {user};
	} catch (error) {
		await conn.query('ROLLBACK');
		return {error: error.message};
	} finally {
		conn.release();
	}
};

const getUserDetail = async (email, roleId) => {
	try {
		if (roleId) {
			// 付費會員
		} else {
			const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
			return users[0];
		}
	} catch (error) {
		return {error:error.message};
	} 
};



module.exports = {
	USER_ROLE,
	signUp,
	setProfile,
	uploadImage,
	signIn,
	getUserDetail
};