import Router from 'express';
import gameSchema from '../models/gameModel.js';
const cartRouter = Router();

const mapCartGame = (cart) => {
	return cart.items.map((c) => ({
		...c.gameID._doc,
		id: c.gameID.id,
		count: c.count,
		allPrice: c.allPrice,
		priceGame: c.price,
	}));
};

const computePrice = (games) => {
	return games.reduce((total, game) => {
		return (total += game.price * game.count);
	}, 0);
};

cartRouter.post('/add', async (req, res) => {
	const gameModel = await gameSchema.findById(req.body.id);
	await req.user.addToCart(gameModel);
	res.redirect('/cart');
});

cartRouter.get('/', async (req, res) => {
	const user = await req.user.populate('cart.items.gameID');
	const gameModels = mapCartGame(user.cart);
	res.render('cart', {
		title: 'Cart',
		isCart: true,
		gameModel: gameModels,
		price: computePrice(gameModels),
	});
});

cartRouter.delete('/delete/:id', async (req, res) => {
	await req.user.deleteFromCart(req.params.id);
	const user = await req.user.populate('cart.items.gameID');
	const gameModels = mapCartGame(user.cart);
	const cartModels = {
		gameModel: gameModels,
		price: computePrice(gameModels),
	};

	res.status(200).json(cartModels);
});

export default cartRouter;
