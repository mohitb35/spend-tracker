const config = require('../config');

const express = require('express');
const router = express.Router();

const axios = require('axios');

// Add Spend Route
router.post("/", async (req,res) => {
	req.body.token = req.session.token;

	let body = JSON.stringify({
		name: req.body['item-name'],
		amount: req.body['amount'],
		categoryId: req.body['category'],
		subCategoryId: req.body['sub-category'],
		purchaseDate: req.body['date'],
		token: req.body['token']
	});

	try {
		const response = await axios.post(
			config.serverUrl + "/spend",
			body,
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		res.redirect('/dashboard');
	} 
	catch(error) {
		console.log("Error while adding spend:", error.response.data, error.response.status, error.response.statusText);
	}

	
	/* .then(response => {
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
	})  */
});

// List Spends Route
/* router.get("/", async (req, res) => {

}); */

module.exports = router;