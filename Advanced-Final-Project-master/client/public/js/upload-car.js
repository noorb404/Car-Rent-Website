/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-globals */
$(document).ready(() => {
	$(document).on('click', '.inner-div-button', () => {
		const carType = $('#csearch').val();
		const searchType = $('.car-list option:selected').val();
		let url;
		let check;
		const formData = new FormData();
		const file = $('#fileupload').prop('files')[0];
		const seats = $('#seats').val();
		const airBags = $('#airBags').val();
		const roadEntry = $('#roadEntry').val();
		const carModel = $('#carModel').val();
		const engineType = $('#engineType').val();
		const gearBox = $('#gearBox').val();
		const carColor = $('#carColor').val();
		let toDate;
		let fromDate;
		let price;
		let priceDay;
		let milege;
		check = true;
		if (searchType === 'Buy') {
			url = '/upload-sale';
			price = $('#price').val();
			milege = $('#milege').val();
			if ($('#price').val() < 1 || isNaN($('#price').val()) || $('#milege').val() < 1 || isNaN($('#milege').val())) {
				check = false;
			}
		} else {
			url = '/upload-rent';
			fromDate = $('#fromDate').val();
			toDate = $('#toDate').val();
			priceDay = $('#priceDay').val();
			if ($('#fromDate').val() < 1 || $('#toDate').val() < 1 || $('#priceDay').val() < 1 || isNaN($('#priceDay').val())) {
				check = false;
			}
		}
		if ($('#carModel').val() < 1 || $('#gearBox').val() < 1 || $('#engineType').val() < 1 || $('#carColor').val() < 1) check = false;
		if (check) {
			formData.append('img', file);
			formData.append('gearBox', gearBox);
			formData.append('carColor', carColor);
			formData.append('roadEntry', roadEntry);
			formData.append('carModel', carModel);
			formData.append('airBags', airBags);
			formData.append('seats', seats);
			formData.append('engineType', engineType);
			if (searchType === 'Buy') {
				formData.append('milege', milege);
				formData.append('price', price);
				formData.append('action', 'sale');
			} else {
				formData.append('fromDate', fromDate);
				formData.append('toDate', toDate);
				formData.append('priceDay', priceDay);
				formData.append('action', 'rent');
			}
			$.ajax({
				type: 'POST',
				url,
				data: formData,
				processData: false,
				contentType: false,
			}).done((res) => {
				alert('Upload complete');
			}).fail((res) => {
				alert('error!');
			});
		}
		return false;
	});
});
$(document).on('change', '.car-list', () => {
	const container = document.getElementById('infoC');
	container.style.height = '570px';
	container.style.background = '#0a5b79';
	const selected = document.getElementById('cars');

	if (selected.options[selected.selectedIndex].value == 'Buy') {
		document.getElementById('inner-lease').style.display = 'contents';
		$('.inner-div-rent').hide();
		$('.inner-div-buy').show();
	} else if (selected.options[selected.selectedIndex].value == 'Lease') {
		document.getElementById('inner-lease').style.display = 'contents';
		$('.inner-div-rent').show();
		$('.inner-div-buy').hide();
	}
});
/// ////////////////////////////
