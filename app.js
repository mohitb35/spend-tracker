//const config = require('./config'); //For local only

const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('client-sessions');
const axios = require('axios');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/index');
const spendRoutes = require('./routes/spend');
const dashboardRoute = require('./routes/dashboard');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(methodOverride("_method"));

// For local only
/* app.use(sessions({
	cookieName: config.cookieName,
	secret: config.secret,
	duration: config.duration
})); */

app.use(sessions({
	cookieName: process.env.COOKIE_NAME,
	secret: process.env.SECRET,
	duration: process.env.DURATION
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


// Including Routes
app.use('/', indexRoutes);
app.use('/spend', spendRoutes);
app.use('/dashboard', dashboardRoute);


/* Frontend routes */

//404 Route
app.get("*", (req, res) => {
	res.send("404 error. Route not found.");
});


var port = process.env.PORT || 3001;

app.listen(/* process.env.PORT, process.env.IP */port, () => {
	console.log("Spend Tracker server started.." + new Date());
})


