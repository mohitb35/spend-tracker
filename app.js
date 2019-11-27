const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const fetch = require('node-fetch');

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



// Including Routes
app.use('/', indexRoutes);
app.use('/spend', spendRoutes);


/* Frontend routes */
//Dashboard Page
app.get("/dashboard", loginRequired, (req, res) => {
	let token = req.session.token;
	let categories;
	// get list of categories
	fetch(config.serverUrl + "/spend/categories")
		.then(response => response.json())
		.then(response => {
			categories = response;
			res.render("dashboard", {token: token, categories: categories});
		});
});

//404 Route
app.get("*", (req, res) => {
	res.send("404 error. Route not found.");
});


var port = process.env.PORT || 3001;

app.listen(/* process.env.PORT, process.env.IP */port, () => {
	console.log("Spend Tracker server started.." + new Date());
})


