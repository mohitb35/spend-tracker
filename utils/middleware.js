const loginRequired = function (req, res, next) {
	if (!req.session.token) {
		return res.redirect("/login");
	}
	next();
}

const isLoggedIn = function (req, res, next) {
	console.log(req);
	if (req.session.token) {
		return res.redirect("/dashboard");
	}
	next();
}

module.exports = {
	loginRequired,
	isLoggedIn
}