import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		default: 'https://bazametrov.ru/uploads/new-agency/default_logo_user.jpg',
	},
	role: {
		type: String,
		required: true,
		default: 'user',
	},
	cart: {
		items: [
			{
				count: {
					type: Number,
					required: true,
					default: 1,
				},
				gameID: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'gameSchema',
					required: true,
				},
				allPrice: {
					type: Number,
					required: true,
				},
				priceGame: {
					type: Number,
					required: true,
				},
			},
		],
	},
});

userSchema.methods.addToCart = function (game) {
	const clonedItems = [...this.cart.items];
	const index = clonedItems.findIndex((c) => {
		return c.gameID.toString() === game._id.toString();
	});

	if (index >= 0) {
		clonedItems[index].count = clonedItems[index].count + 1;
		clonedItems[index].allPrice = game.price * clonedItems[index].count;
	} else {
		clonedItems.push({
			gameID: game._id,
			count: 1,
			priceGame: game.price,
			allPrice: game.price,
		});
	}

	this.cart = { items: clonedItems };
	return this.save();
};

userSchema.methods.deleteFromCart = function (id) {
	let clonedItems = [...this.cart.items];
	const index = clonedItems.findIndex((c) => c.gameID.toString() === id.toString());

	if (clonedItems[index].count === 1) {
		clonedItems = clonedItems.filter((c) => c.gameID.toString() !== id.toString());
	} else {
		clonedItems[index].count--;
		clonedItems[index].allPrice = clonedItems[index].allPrice - clonedItems[index].priceGame;
	}
	this.cart = { items: clonedItems };
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};
export default mongoose.model('userSchema', userSchema);
