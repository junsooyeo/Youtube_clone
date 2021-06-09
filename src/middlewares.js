export const localMiddlewares = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "Youtube_Clone";
	res.locals.loggedInUser = req.session.user;
	console.log(res.locals);
	next();
};
