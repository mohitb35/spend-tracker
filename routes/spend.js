const config = require('../config');

const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

router.post("/", (req,res) => {
	req.body.token = req.session.token;

	fetch(config.serverUrl + "/spend", {
		method: "POST",
		mode: "cors",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: req.body['item-name'],
			amount: req.body['amount'],
			categoryId: req.body['category'],
			subCategoryId: req.body['sub-category'],
			purchaseDate: req.body['date'],
			token: req.body['token']
		})
	})
	.then(response => response.json())
	.then(response => {
		if(response.id){
			console.log("Added spend successfully");
			res.redirect('/dashboard');
		} else {
			console.log(response);
			res.redirect('back');
		}
	})
	.catch(err => {
		console.log(err);
		res.redirect('back');
	}) 
});

module.exports = router;