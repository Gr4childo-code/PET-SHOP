import userSchema from '../models/userModel.js';

const userSessionToModule = async (req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	req.user = await userSchema.findById(req.session.user._id);
	next();
};

export default userSessionToModule;
