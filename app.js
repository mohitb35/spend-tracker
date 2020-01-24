const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const axios = require('axios');

const indexRoutes = require('./routes/index');
const spendRoutes = require('./routes/spend');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(sessions({
	cookieName: config.cookieName,
	secret: config.secret,
	duration: config.duration
}));

/* app.use((req, res, next) => {
	if(!(req.session && req.session.userId)) {
		return next();
	}

	User.findById(req.session.userId, (err, user) => {
		if (err) {
			return next(err);
		}

		if(!user) {
			return next();
		}

		user.password = undefined;

		req.user = user;
		res.locals.user = user;

		next();
	});
}); */

function loginRequired(req, res, next) {
	if (!req.session.token) {
		return res.redirect("/login");
	}

	next();
}

function getMonths(minDateStr, maxDateStr, fromDateStr){
	let minDate = new Date(minDateStr);
	let maxDate = new Date(maxDateStr);
	let fromDate = new Date(fromDateStr).toLocaleDateString();
	let minMonth = minDate.getMonth();
	let minYear = minDate.getFullYear();
	let maxMonth = maxDate.getMonth();
	let maxYear = maxDate.getFullYear();
	
	const monthRef = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const monthRange = [];

	let isMonthSelected = false;

	for(let year = minYear; year<=maxYear; year++){
		let firstMonth = (year === minYear) ? minMonth : 0;
		let lastMonth = (year === maxYear) ? maxMonth : 11;
	
		if(year === minYear) {
			firstMonth = minMonth;
		} 

		if(year === maxYear) {
			lastMonth = maxMonth;
		}

		for(let month = firstMonth; month<=lastMonth; month++){
			let dateObj = {};
			dateObj.text = `${monthRef[month]} ${year}`;
			dateObj.date = new Date(year, month, 1).toLocaleDateString();

			if (dateObj.date == fromDate) {
				dateObj.selected = true;
				isMonthSelected = true;
			} else {
				dateObj.selected = false;
			}
			monthRange.push(dateObj);
		} 
	}
	if(!isMonthSelected){
		monthRange[monthRange.length-1].selected = true;
	}

	return monthRange;
}

function monthBounds() {
	let date = new Date();
	let firstDay = new Date(date.getFullYear(), date.getMonth(), 1); 
	let lastDay =  new Date(date.getFullYear(), date.getMonth() + 1, 0); 
	return {
		firstDay: toDateString(firstDay),
		lastDay: toDateString(lastDay)
	}
}

function toDateString(date) {
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}


// Including Routes
app.use('/', indexRoutes);
app.use('/spend', spendRoutes);


/* Frontend routes */
//Dashboard Page
app.get("/dashboard", loginRequired, async (req, res) => {
	let fromDate = req.query.from;
	let toDate = req.query.to;

	let token = req.session.token;
	let categories, monthRange, spends;
	// get list of categories
	try {
		const categoryResponse = await axios.get(config.serverUrl + "/spend/categories");
		categories = categoryResponse.data;
	} 
	catch(error) {
		console.log("Error fetching categories:", error.response.data, error.response.status, error.response.statusText);
	}

	// Get list of dates
	try {
		const dateResponse = await axios.get(config.serverUrl + `/spend/${token}/daterange`);
		let returnedDates = dateResponse.data;
		if(returnedDates === "No spends found"){
			monthRange = "No spends found";
		} else {
			monthRange = getMonths(returnedDates.min, returnedDates.max, fromDate);
			if(fromDate === undefined || toDate === undefined){
				let lastMonth = monthBounds(monthRange[monthRange.length-1].date);
				fromDate = lastMonth.firstDay;
				toDate = lastMonth.lastDay;
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
		const spendResponse = await axios.get(config.serverUrl + `/spend`, {
			data: {
				token: token,
				minDate: fromDate,
				maxDate: toDate
			}
		});
		spends = spendResponse.data;
		console.log(spends);
	} 
	catch(error) {
		console.log("Error fetching spends:", error);
	}

	res.render("dashboard", {token: token, categories: categories, monthRange: monthRange, spends: spends, fromDate: fromDate, page: "dashboard"});
});

//404 Route
app.get("*", (req, res) => {
	res.send("404 error. Route not found.");
});


var port = process.env.PORT || 3001;

app.listen(/* process.env.PORT, process.env.IP */port, () => {
	console.log("Spend Tracker server started.." + new Date());
})


