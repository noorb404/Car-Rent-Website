/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'relax take it easy';
const COOKIE_NAME = 'cookie-jwt-access-token';

/**
 * use the authentcation cookie to parse a user object inside the request
 * cookie is signed with jwt, could be implemented with other methods
 */
function parseUser(req, res, next) {
	const token = req.cookies[COOKIE_NAME];
	if (token) {
		try {
			const user = jwt.verify(token, JWT_SECRET);
			req.user = user;
		} catch (err) {
			res.clearCookie(COOKIE_NAME);
		}
	}
	next();
}

/**
 * Middleware to make sure the request is authorized, by checking the user
 * value of the request
 */
function authorized(req, res, next) {
	if (!req.user) {
		return res.redirect('/loginMsg');
	}
	return next();
}

/**
 * Middleware to make sure the user is not authenticated by checking the user value of the request
 */
function anonymouse(req, res, next) {
	if (req.user) {
		return res.redirect('/');
	}
	return next();
}

module.exports = {
	authorized,
	parseUser,
	anonymouse,
};
