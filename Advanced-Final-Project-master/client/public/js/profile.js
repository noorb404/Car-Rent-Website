/* eslint-disable linebreak-style */
/* eslint-disable no-array-constructor */
/* eslint-disable no-underscore-dangle */

const items = new Array();

$(document).ready(() => {
	$.get('/client-sale-collection').done((data, status) => {
		$.each(data, (index, item) => {
			$('#client-upload-car-sale').append(`<div class="cars_container" id="${item.filename}">
					<img class="cars_image" src="/img/${item.filename}" height="150" width="100%"/>
			   		<p class="cars_name" >${item.carModel}</p>
                	<p class="cars_desc" >${item.seats} Adults, ${item.airBags} bags</p>
                	<button class="btn-submit"  >delete</button>
                    </div>`);
		});
	}).fail((err) => {
		console.log('error');
	});
	$.get('/client-rent-collection').done((data, status) => {
		$.each(data, (index, item) => {
			$('#client-upload-car-rent').append(`<div class="cars_container" id="${item.filename}">
					<img class="cars_image" src="/img/${item.filename}" height="150" width="100%"/>
			   		<p class="cars_name" >${item.carModel}</p>
                	<p class="cars_desc" >${item.seats} Adults, ${item.airBags} bags</p>
                	<button class="btn-submit" >delete</button>
                    </div>`);
		});
	}).fail((err) => {
		console.log('error');
	});
	$.get('/client-out-orders').done((data, status) => {
		// user out orders
		console.log('out orders');
		console.log(data);

		$.each(data, (index, element) => {
			if (element.action === 'sale') {
				// element._id is equal to the order id and diffrent from carID
				$('#client-request-car-sale').append(`<div class="cars_container" id="${element._id}" >
				<p class="cars_name" >${element.model}</p>
				<p class="order_type" > <b>Order type: Buy </b></p>
				<p class="car_owner" > <b>car owner:  ${element.owner} </b></p>
				<p class="order_status" ><b>Order Status: ${element.response}</b></p>
				</div>`);
			} else {
				// element._id is equal to the order id and diffrent from carID
				$('#client-request-car-rent').append(`<div class="cars_container" id="${element._id}" >
				<p class="cars_name" >${element.model}</p>
				<p class="order_type" > <b>Order type: Rent </b></p>
				<p class="car_owner" > <b>car owner:  ${element.owner} </b></p>
				<p class="order_status" ><b>Order Status: ${element.response}</b></p>
				</div>`);
			}
		});
	}).fail((err) => {
		console.log('error', err);
	});
	$.get('/client-in-orders').done((data, status) => {
		// user income orders
		console.log('income orders: ');

		$.each(data, (index, element) => {
			// if the request response is not yet enable the buttons
			console.log(element);
			console.log(`order id: ${element._id}`);
			items.push(element);
			const active = (element.response === 'not yet');
			if (element.action === 'sale') {
				// element._id is equal to the order id and diffrent from carID
				$('#client-receive-sale-request').append(`<div class="cars_container" id="${element._id}" >
						<p class="cars_name">${element.model}</p>
						<p class="order_type">Order type: Buy</p>
						<p class="car_owner">Request from:  ${element.username}</p>
						<p class="order_status">Order Status: ${element.response}</p>
						<button class="resp_btn_accept">Accept Order</button>
						<button class="resp_btn_reject">Reject Order</button>
						</div>`);
			} else {
				// element._id is equal to the order id and diffrent from carID
				$('#client-receive-rent-request').append(`<div class="cars_container"id="${element._id}" >
						<p class="cars_name">${element.model}</p>
						<p class="order_type">Order type: Rent</p>
						<p class="car_owner">Request from:  ${element.username}</p>
						<p class="order_status">Order Status: ${element.response}</p>
						<button class="resp_btn_accept" >Accept Order</button>
						<button class="resp_btn_reject">Reject Order</button>
						</div>`);
			}
		});
	}).fail((err) => {
		console.log('error');
	});
	$(document).on('click', '.btn-submit', function () {
		const giganotosaurus = $(this).closest('.cars_container').attr('id');
		const quetzal = $(this).closest('.cars_container').parent().attr('id');

		console.log(`giganotosaurus is: ${giganotosaurus}`);
		console.log(`quetzal is: ${quetzal}`);

		let paraceratherium;
		let pteranodon = 'r';
		if (quetzal.includes('s'))pteranodon = 's';

		$.post('/delete-car', { giganotosaurus, pteranodon }, 'json').done((res, status) => {
			if (status) { alert('item deleted from data'); }
		}).fail((res) => {
			alert('error deleting data');
		});
	});

	$(document).on('click', '.resp_btn_reject', function () {
		const _id = $(this).closest('.cars_container').attr('id');
		const response = 'Rejected';

		console.log(`click belong to ${_id}`);

		const confirm = window.confirm(`Are you sure you want to ${response} order: ${_id}`);
		if (confirm) {
			const data = { _id, response };
			$.post('/order-response', data, 'json').done((res) => {
				window.alert(`Order status changed to ${response}`);
				// disable the buttons after confirm/reject the order
			}).fail((res) => {
				window.alert('Cant update order status try again late');
			});
		} else {
			alert('Aborting...');
		}
	});
	$(document).on('click', '.resp_btn_accept', function () {
		const _id = $(this).closest('.cars_container').attr('id');
		const response = 'Accepted';

		console.log(`click belong to ${_id}`);

		const confirm = window.confirm(`Are you sure you want to ${response} order: ${_id}`);
		if (confirm) {
			const data = { _id, response };
			$.post('/order-response', data, 'json').done((res) => {
				window.alert(`Order status changed to ${response}`);
				// disable the buttons after confirm/reject the order
			}).fail((res) => {
				window.alert('Cant update order status try again late');
			});
		} else {
			alert('Aborting...');
		}
	});
});
