/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-array-constructor */
/* eslint-disable radix */

const items = new Array(); /// this array contain items list

$(document).ready(() => {
	$(document).on('click', '.inner-div-button', () => {
		const carType = $('#csearch').val();
		const searchType = $('.car-list option:selected').val();
		const startDate = $('#fromDate').val();
		const endDate = $('#toDate').val();
		const minPrice = $('#fromPrice').val();
		const maxPrice = $('#toPrice').val();
		let url;
		if (searchType === 'Buy') url = '/show-buy';
		else url = '/show-rent';
		$('#lease_cars_div').html('');
		$('#sale_cars_div').html('');
		if (url === '/show-buy') {
			$.post(url, { carType }, 'json').done((res, status) => {
				divName = '#sale_cars_div';
				let i = 0;
				$.each(res, (index, item) => {
					items.push(item);

					$(divName).append(`<div class="cars_container" id="${item.filename}">
					<img class="cars_image" src="/img/${item.filename}" height="150" width="100%"/>
			   		<p class="cars_name" >${item.carModel}</p>
                	<p class="cars_desc" >${item.seats} Adults, ${item.airBags} bags</p>
			   		<p class="available" >Available!</p>
			   		<p class="cars_price" ><b>price:</b>${item.price}</p>
                	<button class="cars_order" id = "${i}" >Order now</button>
                	</div>`);
					$('#Price-div').append(item.price);
					$('#Model-div').append(item.carModel);
					$('#Year-div').append(item.roadEntry);
					$('#Gearbox-div').append(item.gearBox);
					$('#Color-div').append(item.carColor);
					$('#Seats-div').append(item.seats);
					$('#Bags-div').append(item.airBags);
					$('#Available-div').append('Yes');
					i++;
				});
				$('button').click(function () {
					console.log(this.id);
					if (this.id != 'show-btn') {
						orderNow(this.id);
					}
				});
			}).fail((res) => {
				alert('error!');
			});
		} else { // url = /show-rent
			divName = '#lease_cars_div';
			$.post(url, {
				startDate, endDate, minPrice, maxPrice,
			}, 'json').done((res, status) => {
				let i = 0;
				$.each(res, (index, item) => {
					items.push(item);

					$(divName).append(`<div class="cars_container" id = "${item.filename}">
					<img class="cars_image" src="/img/${item.filename}" height="150" width="100%"/>
					<p class="cars_name" >${item.carModel}</p>
					<p class="cars_desc" >${item.seats} Adults, ${item.airBags} bags</p>
					<p class="cars_leas_date">From Date: ${item.fromDate} to Date: ${item.toDate}</p>
					<p class="available" >Available!</p>
					<p class="cars_price" ><b>Price per Day:</b>${item.priceDay}</p>
				 	<button class="cars_order" id = "${i}" >Order now</button>
					</div>`);
					$('#Price-div').append(item.priceDay);
					$('#Model-div').append(item.carModel);
					$('#Year-div').append(item.roadEntry);
					$('#Gearbox-div').append(item.gearBox);
					$('#Color-div').append(item.carColor);
					$('#Seats-div').append(item.seats);
					$('#Bags-div').append(item.airBags);
					$('#Available-div').append('Yes');
					i++;
				});
				$('button').click(function () {
					console.log(this.id);
					if (this.id != 'show-btn') {
						orderNow(this.id);
					}
				});
			}).fail((res) => {
				alert('error!');
			});
		}
	});
});

function orderNow(index) {
	// index is equal the the index of the car in the array
	const order = items[parseInt(index)];

	let action;
	let priceMsg;

	if (order.action === 'sale') {
		action = 'buy';
		priceMsg = `${order.price} NIS`;
	} else {
		action = 'rent';
		actionMsg = ` ${order.priceDay} NIS per day`;
	}

	const conf = window.confirm(`please confirm to ${action} ${order.carModel}`);

	if (conf) {
		const carID = order._id;
		const owner = order.username;
		const model = order.carModel;
		const response = 'not yet';
		const data = {
			carID, model, action, response, owner,
		};
		$.post('/insert-order', data, 'json').done((res) => {
			window.alert('your Order sent to the car owner');
		}).fail((res) => {
			alert('an error accured try again later...');
		});
	} else {
		window.alert('your Order have been canceled.');
	}
}

function getSelect() {
	const container = document.getElementById('infoC');
	container.style.height = '400px';
	container.style.background = '#0a5b79';
	const selected = document.getElementById('cars');

	if (selected.options[selected.selectedIndex].value == 'Buy') {
		document.getElementById('inner-lease').style.display = 'contents';
		document.getElementById('csearch').style.display = 'inline';
		document.getElementById('csearch-label').style.display = 'inherit';
	} else if (selected.options[selected.selectedIndex].value == 'Lease') {
		document.getElementById('inner-lease').style.display = 'contents';
		document.getElementById('csearch').style.display = 'none';
		document.getElementById('csearch-label').style.display = 'none';
	}
}
