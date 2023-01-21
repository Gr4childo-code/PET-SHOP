import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
	games: [
		{
			game: {
				type: Object,
				required: true,
			},
			count: {
				type: Number,
				require: true,
			},
		},
	],
	user: {
		username: String,
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'userSchema',
			required: true,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('orderSchema', orderSchema);
