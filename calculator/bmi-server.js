const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/bmi-calculator.html");
});

app.post("/bmi-calculator.html", function (req, res) {
	let weight = parseFloat(req.body.weight);
	let height = parseFloat(req.body.height);
	let bmi = weight / height ** 2;
	res.send("Your BMI is: " + bmi);
	// Test 2 - git revert - to be removed.
});

app.listen(port, function () {
	console.log("Server is listening on port " + port);
});

// 1.87 m (3.4969)
// 115.6 kg
//
// BMI: 33.1
