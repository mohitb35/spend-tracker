// const config = require('../config'); //For local only

const express = require('express');
const router = express.Router();

const axios = require('axios');

const { loginRequired } = require('../utils/middleware');
const { getMonths, monthBounds } = require('../utils/helpers');

const serverUrl = process.env.SERVER_URL;
// const serverUrl = config.serverUrl; // for local only

//Dashboard Page
router.get("/", loginRequired, async (req, res) => {
	let fromDate = req.query.from;
	let toDate = req.query.to;

	let token = req.session.token;
	let userName = req.session.userName;
	let categories, monthRange, spends;

	// get list of categories
	try {
		const categoryResponse = await axios.get(`${serverUrl}/spend/categories`);
		categories = categoryResponse.data;
	} 
	catch(error) {
		console.log(error);
		console.log("Error fetching categories:", error.response.data, error.response.status, error.response.statusText);
	}

	// Get list of dates for month selector
	try {
		const dateResponse = await axios.get(`${serverUrl}/spend/${token}/daterange`);
		let returnedDates = dateResponse.data;
		if(returnedDates === "No spends found"){
			monthRange = "No spends found";
		} else {
			monthRange = getMonths(new Date(returnedDates.min), new Date(), new Date(fromDate));
			if(fromDate === undefined || toDate === undefined){
				let lastMonth = monthBounds(monthRange[monthRange.length-1].date);
				fromDate = lastMonth.firstDay;
				toDate = lastMonth.lastDay;
				// console.log(fromDate, toDate);
			}
		}
	} 
	catch(error) {
		console.log(error);
		// console.log("Error fetching spend dates:", error.response.data, error.response.status, error.response.statusText);
		monthRange = "Something went wrong";
	}
	
	// Get list of spends
	try {
		const spendResponse = await axios.get(`${serverUrl}/spend`, {
			data: {
				token: token,
				minDate: fromDate,
				maxDate: toDate
			}
		});
		spends = spendResponse.data;
		// console.log(spends);
	} 
	catch(error) {
		spends = "An error occurred. Please log out and sign in again.";
		console.log("Error fetching spends:", error.response.data, error.response.status, error.response.statusText);
	}

	res.render("dashboard", {
		token: token, 
		userName: userName, 
		categories: categories, 
		monthRange: monthRange, 
		spends: spends, 
		fromDate: fromDate, 
		page: "dashboard"});
});

module.exports = router;