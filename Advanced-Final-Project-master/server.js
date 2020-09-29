/* eslint-disable linebreak-style */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const methodOverride = require('method-override');
const authRouter = require('./routes/auth');
const { routerUpload } = require('./routes/upload');

const { parseUser, anonymouse, authorized } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'client', 'public')));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(parseUser);
app.use(authRouter);
app.use(routerUpload);
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	fs.createReadStream('./client/home.html').pipe(res);
});

app.get('/login', anonymouse, (req, res) => {
	fs.createReadStream('./client/login.html').pipe(res);
});
app.get('/register', anonymouse, (req, res) => {
	fs.createReadStream('./client/reg.html').pipe(res);
});
app.get('/post-car', authorized, (req, res) => {
	fs.createReadStream('./client/upload-car.html').pipe(res);
});
app.get('/contact-us', (req, res) => {
	fs.createReadStream('./client/contact-us.html').pipe(res);
});
app.get('/loginMsg', (req, res) => {
	fs.createReadStream('./client/loginMsg.html').pipe(res);
});
app.get('/search-car', authorized, (req, res) => {
	fs.createReadStream('./client/search-car.html').pipe(res);
});

app.get('/profile', authorized, (req, res) => {
	fs.createReadStream('./client/profile.html').pipe(res);
});
app.listen(PORT, () => {
	console.log(`Node server is running on port ${PORT}...`);
});
