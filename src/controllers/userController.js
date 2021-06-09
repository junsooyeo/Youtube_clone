import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const edit = (req, res) => res.send("USER EDIT");
export const getJoin = (req, res) =>
	res.render("join", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
	const { name, email, username, password, password2, location } = req.body;
	const pageTitle = "Create Account";
	if (password !== password2) {
		return res.status(400).render("join", {
			pageTitle,
			errorMsg: "Password confirmation does not match.",
		});
	}
	const exists = await User.exists({ $or: [{ email }, { username }] });
	if (exists) {
		return res.status(400).render("join", {
			pageTitle,
			errorMsg: "Email / Username already exists.",
		});
	}
	try {
		await User.create({ name, email, username, password, location });
		return res.redirect("/login");
	} catch (error) {
		return res.status(400).render("join", {
			pageTitle: "Join Error",
			errorMsg: error._message,
		});
	}
};

export const see = (req, res) => {
	console.log(`Wathching #${req.params.id}`);
	return res.send("SEE USER");
};

export const getLogin = (req, res) =>
	res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username, socialOnly: false });
	if (!user) {
		return res.status(400).render("login", {
			pageTitle: "Login Failed",
			errorMsg: "An account with this username does not exists.",
		});
	}
	const success = await bcrypt.compare(password, user.password);
	if (!success) {
		return res.status(400).render("login", {
			pageTitle: "Login Failed",
			errorMsg: "Wrong Password",
		});
	}
	req.session.loggedIn = true;
	req.session.user = user;
	res.redirect("/");
};

export const startGithubLogin = (req, res) => {
	const baseURL = "https://github.com/login/oauth/authorize";
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: "false",
		scope: "read:user user:email",
	};
	const params = new URLSearchParams(config).toString();
	const finalURL = `${baseURL}?${params}`;
	return res.redirect(finalURL);
};

export const finishGithubLogin = async (req, res) => {
	const baseURL = "https://github.com/login/oauth/access_token";
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code: req.query.code,
	};
	const params = new URLSearchParams(config).toString();
	const finalURL = `${baseURL}?${params}`;
	const tokenRequest = await (
		await fetch(finalURL, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
		})
	).json();
	if ("access_token" in tokenRequest) {
		const { access_token } = tokenRequest;
		const apiURL = "https://api.github.com";
		const userData = await (
			await fetch(`${apiURL}/user`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		const emailData = await (
			await fetch(`${apiURL}/user/emails`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		const emailObj = emailData.find(
			(email) => email.primary === true && email.verified === true
		);
		console.log(emailObj);
		if (!emailObj) {
			return res.redirect("/login");
		}
		const user = await User.findOne({ email: emailObj.email });
		if (!user) {
			const user = await User.create({
				name: userData.name,
				avatarURL: userData.avatarURL,
				username: userData.login,
				email: emailObj.email,
				password: "",
				socialOnly: true,
				location: userData.location,
			});
		}
		req.session.loggedIn = true;
		req.session.user = user;
		res.redirect("/");
	} else {
		res.redirect("/login");
	}
};

export const logout = (req, res) => {
	req.session.destroy();
	return res.redirect("/");
};

export const remove = (req, res) => res.send("REMOVE USER");
