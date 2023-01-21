import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	genre: {
		type: String,
		required: true,
	},
	img: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'userSchema',
	},
});

gameSchema.method('toClient', function () {
	const game = this.toObject();
	game.id = game._id;
	delete game._id;
	return game;
});
export default mongoose.model('gameSchema', gameSchema);
