/* eslint-disable linebreak-style */
$(() => {
	const st = 'use strict';

	const winH = $(window).height();
	const upperH = $('.upper-bar').innerHeight();
	const navH = $('.navbar').innerHeight();
	$('.slider .carousel-item').height(winH - (upperH + navH));
});
