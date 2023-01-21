import Router from 'express';
import gameSchema from '../models/gameModel.js';
import { authMW, authRooted } from '../middleware/authMW.js';
const listRouter = Router();

listRouter.get('/', async (req, res) => {
	const gameModel = await gameSchema.find();
	res.render('list/list', { title: 'List page', isList: true, gameModel });
});

listRouter.post('/edit', authRooted, async (req, res) => {
	const { id } = req.body;
	delete req.body.id;
	await gameSchema.findByIdAndUpdate(id, req.body);
	res.redirect('/list');
});

listRouter.get('/one/:id', async (req, res) => {
	const gameModel = await gameSchema.findById(req.params.id);
	res.render('list/listOne', {
		title: `${gameModel.title}`,
		gameModel,
	});
});

listRouter.get('/:id/edit', authRooted, async (req, res) => {
	const gameModel = await gameSchema.findById(req.params.id);
	if (!req.query.allow) {
		return res.redirect('/');
	} else {
		res.render('list/list_edit', {
			title: `${gameModel.title}`,
			gameModel,
		});
	}
});
listRouter.post('/remove', authRooted, async (req, res) => {
	try {
		await gameSchema.findByIdAndDelete({
			_id: req.body.id,
		});
		res.redirect('/list');
	} catch (error) {
		console.log(error);
	}
});

listRouter.get('/list_add', authRooted, (req, res) => {
	res.render('list/list_add', { title: 'list_add', isListAdd: true });
});

listRouter.post('/list_add', authRooted, async (req, res) => {
	const gameModels = new gameSchema({
		title: req.body.title,
		genre: req.body.genre,
		img: req.body.img,
		price: req.body.price,
		userID: req.user,
		description: req.body.description,
	});

	try {
		await gameModels.save();
		res.redirect('/list');
	} catch (error) {
		console.log(error);
	}
});

export default listRouter;
