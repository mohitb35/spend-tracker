// const config = require('../config'); //For local only

const express = require('express');
const router = express.Router();

const axios = require('axios');

const { isLoggedIn } = require('../utils/middleware');

const serverUrl = process.env.SERVER_URL; 

// Landing Page/Login
router.get("/", isLoggedIn, (req, res) => {
	res.redirect(301, "/login");
});

router.get("/login", isLoggedIn, (req, res) => {
	res.render("login", {page:"login", errorMessage:"", email:""});
});

router.post("/login", async (req,res) => {
	let body = JSON.stringify({
		email: req.body.email,
		password: req.body.password
	});

	try {
		const response = await axios.post(
			`${serverUrl}/login`, 
			body,
			{
				headers: {
					'Content-Type': 'application/json'
				}
		})

		const user = response.data;

		req.session.userId = user.user_id;
		req.session.userName = user.name;
		req.session.token = user.token;
		
		res.redirect('/dashboard');

	} catch (error) {
		let errorMessage = "";
		
		if (error.response){
			console.log("Error while logging in:", error.response.data, error.response.status, error.response.statusText);
			if (error.response.status === 401 || error.response.status === 400){
				errorMessage = "Invalid credentials. Please check your email and password";
			} else {
				errorMessage = "Oops, something went wrong. Please try again after some time";
			}
		} else {
			console.log(error);
			errorMessage = "Oops, the server's not responding. Please try again after some time";
		}
		
		res.render("login", {page:"login", errorMessage, email:req.body.email});
	}
}); 


router.get("/register", isLoggedIn, (req, res) => {
	res.render("register", {page:"register", errorMessage:""});
});

router.post("/register", async (req, res) => {
	let body = JSON.stringify({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	try {
		const response = await axios.post(
			`${serverUrl}/register`, 
			body,
			{
				headers: {
					'Content-Type': 'application/json'
				}
		});

		const user = response.data;

		req.session.userId = user.user_id;
		req.session.userName = user.name;
		req.session.token = user.token;
		
		res.redirect('/dashboard');

	} catch (error) {
		let errorMessage = "";
		
		if (error.response){
			console.log("Error while registering:", error.response.data, error.response.status, error.response.statusText);
			if (error.response.status === 409 ){
				errorMessage = "You seem to have already registered. Please log in, or check the email entered.";
			} else {
				errorMessage = "Oops, something went wrong. Please try again after some time";
			}
		} else {
			console.log(error);
			errorMessage = "Oops, the server's not responding. Please try again after some time";
		}

		res.render("register", {page:"register", errorMessage});
	}
});

router.get('/logout', (req,res) => {
	let token = req.session.token;
	let userId = req.session.userId;

	try {
		axios.get(`${serverUrl}/logout`, {
			data: {
				userId: userId,
				token: token
			}
		});
	} catch(error) {
		console.log("Error while logging out:", error.response.data, error.response.status, error.response.statusText);
	}

	req.session.reset();
	res.redirect('/login');
});

module.exports = router;