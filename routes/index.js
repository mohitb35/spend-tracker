const config = require('../config');

const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');


// Landing Page/Login
router.get("/", (req, res) => {
	res.redirect(301, "/login");
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req,res, next) => {
	fetch(config.serverUrl + "/login", {
		method: "POST",
		mode: "cors",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: req
	})
	.then(response => response.json())
	.then(response => {
		if(response.user_id){
			req.session.userId = response.user_id;
			req.session.userName = response.name;
			req.session.token = response.token;
			// res.locals.user = user;
			res.redirect('/dashboard');
		} else {
			throw Error(response);
		}
	})
	.catch(err => {
		console.log(err);
		res.render("login");
	})
});


router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	fetch(config.serverUrl + "/register", {
		method: "POST",
		mode: "cors",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: req
	})
	.then(response => response.json())
	.then(response => {
		if(response.user_id){
			req.session.userId = response.user_id;
			req.session.userName = response.name;
			req.session.token = response.token;
			res.redirect('/dashboard');
		} else {
			throw Error(response);
		}
	})
	.catch(err =>  {
		console.log(err);
		res.render("register");
	})
});


module.exports = router;