export const authMW = (req, res, next) => {
	if (!req.session.isAuthenticated) {
		return res.redirect('/auth/login');
	}

	next();
};
export const authRooted = (req, res, next) => {
	if (!req.session.isRooted) {
		return res.redirect('/auth/login');
	}
	next();
};
