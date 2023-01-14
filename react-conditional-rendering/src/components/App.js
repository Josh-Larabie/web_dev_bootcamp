import React from "react";

let isLoggedIn = false;

function App() {
	return (
		<div className="container">
			{isLoggedIn ? (
				<h1>Hello</h1>
			) : (
				<form className="form">
					<input type="text" placeholder="Username" />
					<input type="password" placeholder="Password" />
					<button type="submit">Login</button>
				</form>
			)}
		</div>
	);
}

export default App;
