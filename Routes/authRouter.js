import Router from 'express';
import userSchema from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
const authRouter = Router();

authRouter.get('/login', (req, res) => {
	res.render('auth/login', {
		title: 'Sign in',
		isLogin: true,
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

		if (!candidate) {
			console.log('Email not found');
		}
		bcryptjs.compare(password, candidate.password, (err, success) => {
			if (err) {
				console.log(err);
			}
			if (success) {
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
				console.log(success);
				console.log('pass incorrect');
			}
		});
	} catch (error) {
		console.log(error);
	}
});

authRouter.post('/register', async (req, res) => {
	try {
		const { email, username, password, rpassword } = req.body;
		if (await userSchema.findOne({ email })) {
			console.log('This email is busy');
		} else if (await userSchema.findOne({ username })) {
			console.log('This username is busy');
		} else if (password !== rpassword) {
			console.log('passwords dont match');
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
