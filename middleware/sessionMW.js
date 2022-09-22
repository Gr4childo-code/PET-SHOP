const sessionMW = function (req, res, next) {
	res.locals.isAuth = req.session.isAuthenticated;
	res.locals.isRoot = req.session.isRooted;
	res.locals.csrf = req.csrfToken();

	next();
};

export default sessionMW;
