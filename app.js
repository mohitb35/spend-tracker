//I can edit the file - other user
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

/* Frontend routes */
// Landing Page/Login
app.get("/", (req, res) => {
	res.render("login");
});

//Register
app.get("/register", (req, res) => {
	res.render("register");
});

//Dashboard Page
app.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

//404 Route
app.get("*", (req, res) => {
	res.send("404 error. Route not found.");
});


var port = process.env.PORT || 3000;

app.listen(/* process.env.PORT, process.env.IP */port, () => {
	console.log("Spend Tracker server started..")
})


