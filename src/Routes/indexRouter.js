import Router from 'express';

const indexRouter = Router();

indexRouter.get('/', async (req, res) => {
	res.render('index', { title: 'Index page', isIndex: true });
});
export default indexRouter;
