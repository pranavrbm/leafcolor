import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				{/* <li>
					<Link to="/Home">About</Link>
				</li> */}
				<li>
					<Link to="/Profile">Base</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
