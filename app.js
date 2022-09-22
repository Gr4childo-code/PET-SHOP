// Imports library
import express from 'express';
import hbs from 'hbs';
import expressHbs from 'express-handlebars';
import 'dotenv/config';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import csurf from 'csurf';

// Import Routes
import indexRouter from './Routes/indexRouter.js';
import listRouter from './Routes/listRouter.js';
import cartRouter from './Routes/cartRouter.js';
import userRouter from './Routes/userRouter.js';
import ordersRouter from './Routes/ordersRouter.js';
import authRouter from './Routes/authRouter.js';

// Import MiddleWare
import sessionMW from './middleware/sessionMW.js';
import userSessionToModule from './middleware/userSessionToModule.js';
import { authMW, authRooted } from './middleware/authMW.js';
//DB Connect
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection ERROR'));
db.once('open', () => {
	console.log('Connected');
});

//App
const app = express();
const port = process.env.PORT;

app.engine(
	'hbs',
	expressHbs.engine({
		layoutsDir: 'views/layouts',
		defaultLayout: 'main',
		extname: 'hbs',
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
			allowProtoMethodsByDefault: true,
		},
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(
	session({
		secret: 'Some secret value',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ collectionName: 'session', mongoUrl: process.env.DB_URL }),
	})
);
app.use(csurf());
app.use(sessionMW);
app.use(userSessionToModule);

app.use('/', indexRouter);
app.use('/list', listRouter);
app.use('/cart', authMW, cartRouter);
app.use('/user', authRooted, userRouter);
app.use('/orders', authMW, ordersRouter);
app.use('/auth', authRouter);
app.use(function (req, res, next) {
	res.render('error/404', { status: 404, url: req.url });
});

async function startApp() {
	try {
		mongoose.connect(process.env.DB_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		app.listen(port, () => console.log(`Example app listening on port ${port}!`));
	} catch (error) {
		console.log(error);
	}
}
startApp();
