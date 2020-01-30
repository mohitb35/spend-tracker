const config = require('../config');

const express = require('express');
const router = express.Router();

const axios = require('axios');

function isLoggedIn(req, res, next) {
	if (req.session.token) {
		return res.redirect("/dashboard");
	}

	next();
}

// Landing Page/Login
router.get("/", isLoggedIn, (req, res) => {
	res.redirect(301, "/login");
});

router.get("/login", isLoggedIn, (req, res) => {
	res.render("login", {page:"login"});
});

router.post("/login", async (req,res) => {
	let body = JSON.stringify({
		email: req.body.email,
		password: req.body.password
	});

	try {
		const response = await axios.post(
			config.serverUrl + "/login", 
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
		console.log("Error while logging in:", error.response.data, error.response.status, error.response.statusText);
		res.render("login", {page:"login"});
	}
}); 


router.get("/register", isLoggedIn, (req, res) => {
	res.render("register", {page:"register"});
});

router.post("/register", async (req, res) => {
	let body = JSON.stringify({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	try {
		const response = await axios.post(
			config.serverUrl + "/register", 
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
		console.log("Error while registering:", error.response.data, error.response.status, error.response.statusText);
		res.render("register", {page:"register"});
	}
});

router.get('/logout', (req,res) => {
	let token = req.session.token;
	let userId = req.session.userId;

	try {
		axios.get(config.serverUrl + `/logout`, {
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