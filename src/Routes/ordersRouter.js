import Router from 'express';
import orderSchema from '../models/orderModel.js';
const ordersRouter = Router();

const mapOrders = (cart) => {
	return cart.items.map((c) => ({
		count: c.count,
		price: c.priceGame,
		game: c.gameID._doc,
	}));
};

const computePrice = (games) => {
	return games.reduce((total, c) => {
		return (total += c.game.price * c.count);
	}, 0);
};

ordersRouter.get('/', async (req, res) => {
	try {
		const orders = await orderSchema
			.find({
				'user.userID': req.user._id,
			})
			.populate('user.userID');
		res.render('orders', {
			title: 'Orders page',
			isOrders: true,
			orders: orders.map((o) => {
				return {
					...o._doc,
					price: computePrice(o.games),
				};
			}),
		});
	} catch (error) {
		console.log(error);
	}
});

ordersRouter.post('/', async (req, res) => {
	try {
		const user = await req.user.populate('cart.items.gameID');

		const games = mapOrders(user.cart);
		const order = new orderSchema({
			user: {
				name: req.user.name,
				userID: req.user,
			},
			games: games,
		});
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
});
export default ordersRouter;
