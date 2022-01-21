const config = require('../config');

const express = require('express');
const router = express.Router();

const axios = require('axios');

// Add Spend Route
router.post("/", async (req,res) => {
	req.body.token = req.session.token;
	req.body.userId = req.session.userId;

	let body = JSON.stringify({
		name: req.body['item-name'],
		amount: req.body['amount'],
		categoryId: req.body['category'],
		subCategoryId: req.body['sub-category'],
		purchaseDate: req.body['date'],
		token: req.body['token'],
		userId: req.body['userId']
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
});

// Delete Spend Route
router.delete('/:id', async(req, res) => {

	try {
		const response = await axios.delete(config.serverUrl + "/spend/" + req.params.id,{
			data: {
				token: req.session.token
			},
			headers: {
				'Content-Type': 'application/json'
			}
		});
		res.status(200).json("Deleted spend");
	}
	catch(error) {
		console.log("Error while deleting spend:", error.response.data, error.response.status, error.response.statusText);
		res.status(400).json(error.response.data);
	}
});

// Edit Spend Route
router.put('/:id', async(req, res) => {
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
		const response = await axios.put(
			config.serverUrl + "/spend/" + req.params.id,
			body,
			{
				headers: {
					'Content-Type': 'application/json'
				}
			} 
		);

		res.redirect(req.headers.referer);
	}
	catch(error) {
		console.log("Error while editing spend:", error.response.data, error.response.status, error.response.statusText);
	}
});

// List Spends Route
/* router.get("/", async (req, res) => {

}); */

// Get Chart Data Route
router.get("/summary/:categoryId", async (req, res) => {
	let minDate = req.query.from;
	let maxDate  = req.query.to;
	let categoryId = req.params.categoryId;
	let token = req.session.token;

	let response = await axios.get(`${config.serverUrl}/spend/${token}/summary/${categoryId}`, {
		params: {
			minDate,
			maxDate
		}
	});
	res.status(200).json(response.data);
});

module.exports = router;