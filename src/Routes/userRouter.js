import Router from 'express';
import bcryptjs from 'bcryptjs';
import userSchema from '../models/userModel.js';
import 'dotenv/config';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
	res.render('user_add', { title: 'User_add page', isUser: true });
});

userRouter.post('/', async (req, res) => {
	await bcryptjs.hash(req.body.password, 10).then((hash) => {
		const userModels = new userSchema({
			email: req.body.email,
			password: hash,
			username: req.body.username,
			role: req.body.role,
			cart: { items: [] },
		});
		try {
			userModels.save();
			res.redirect('/list');
		} catch (error) {
			console.log(error);
		}
	});
});

export default userRouter;
