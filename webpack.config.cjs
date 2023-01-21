const path = require('path');

module.exports = {
	target: 'async-node', // Or "async-node"
	mode: 'production' /* or "development", or "none" */,
	entry: './app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'my-first-webpack.bundle.js',
	},
	module: {
		rules: [{ test: /\.handlebars$/, loader: 'handlebars-loader' }],
	},
	resolve: {
		alias: {
			'express-handlebars': 'handlebars/dist/handlebars.js',
		},
	},
};
