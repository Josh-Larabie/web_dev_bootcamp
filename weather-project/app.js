const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const config = require("./config.js"); // Secrets

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
	const city = req.body.cityName;
	const units = "metric";
	const url =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		config.apiKey +
		"&units=" +
		units;

	https.get(url, function (response) {
		console.log(response.statusCode);
		response.on("data", function (data) {
			const weatherData = JSON.parse(data);
			const temp = weatherData.main.temp;
			const desc = weatherData.weather[0].description;
			const icon =
				" http://openweathermap.org/img/wn/" +
				weatherData.weather[0].icon +
				"@2x.png";

			res.write(
				"<h1>" +
					"The temperature in " +
					weatherData.name +
					" is: " +
					temp +
					" degrees Celsius" +
					"</h1>"
			);

			res.write('<body style="background-color:#a6b6ff;">');
			res.write("<h3>" + "The weather is currently " + desc + ".\n" + "</h3>");
			res.write('<img src="' + icon + '" alt="Weather_IMG">');
			console.log(icon);
			res.send();
		});
	});
});

app.listen(3000, function () {
	console.log("The server listening on port 3000");
});
