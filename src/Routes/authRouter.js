import Router from 'express';
import userSchema from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
const authRouter = Router();

authRouter.get('/login', (req, res) => {
	res.render('auth/login', {
		title: 'Sign in',
		isLogin: true,
		isEmailError: req.flash('EmailError'),
		isLoginError: req.flash('LoginError'),
	});
});
authRouter.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
});
authRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const candidate = await userSchema.findOne({ email });

		if (candidate) {
			const areSame = bcryptjs.compare(password, candidate.password);
			if (areSame) {
				const user = candidate;
				req.session.user = user;
				if (user.role === 'user') {
					req.session.isAuthenticated = true;
					req.session.isRooted = false;
					req.session.save((err) => {
						if (err) throw err;
						res.redirect('/');
					});
				} else {
					req.session.isAuthenticated = true;
					req.session.isRooted = true;
					req.session.save((err) => {
						if (err) throw err;
						res.redirect('/');
					});
				}
			} else {
				req.flash('LoginError', 'Password Incorrect');
				res.redirect('/auth/login#login');
			}
		} else {
			req.flash('LoginError', 'Email no found');
			res.redirect('/auth/login#login');
		}
	} catch (error) {
		console.log(error);
	}
});

authRouter.post('/register', async (req, res) => {
	try {
		const { email, username, password, rpassword } = req.body;
		if (await userSchema.findOne({ email })) {
			req.flash('EmailError', 'Email is busy');
		} else if (await userSchema.findOne({ username })) {
			req.flash('EmailError', 'This username is busy');
		} else if (password !== rpassword) {
			req.flash('EmailError', 'passwords dont match');
		} else {
			await bcryptjs.hash(req.body.password, 10).then((hash) => {
				const userModels = new userSchema({
					email: req.body.email,
					password: hash,
					username: req.body.username,
					role: req.body.role,
					cart: { items: [] },
				});
				userModels.save();
				if (userModels.role === 'user') {
					req.session.isAuthenticated = true;
					req.session.isRooted = false;
					req.session.save((err) => {
						if (err) throw err;
						res.redirect('/');
					});
				} else {
					req.session.isAuthenticated = true;
					req.session.isRooted = true;
					req.session.save((err) => {
						if (err) throw err;
						res.redirect('/');
					});
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
});
export default authRouter;
