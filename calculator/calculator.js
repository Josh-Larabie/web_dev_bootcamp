const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// body-parser is used to pull data from html to our express server.
// urlencoded function used specifically to parse from a form.
// extended: true is used to allow us to post nested objects, required to use body-parser.
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
	// req.body is passed the post names:value from our form "body-parser".
	// body-parser will only pull form values as text, will need conversion to Number.
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);
	var result = num1 + num2;

	res.send("The result of the calculation is: " + result);
});

app.listen(PORT, function () {
	console.log("Server is running on port: " + PORT);
});
