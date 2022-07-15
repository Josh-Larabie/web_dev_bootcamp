exports.getDate = function () {
	const today = new Date();
	const dateOptions = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};

	return today.toLocaleDateString("en-us", dateOptions);
};

exports.getDay = function () {
	const today = new Date();
	const dateOptions = {
		weekday: "long",
	};

	return today.toLocaleDateString("en-us", dateOptions);
};
