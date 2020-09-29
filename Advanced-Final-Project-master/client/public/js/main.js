/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-globals */

(function ($) {
	/*= =================================================================
    [ Validate ] */
	const input = $('.validate-input .input100');

	$('.validate-form').on('submit', () => {
		let check = true;

		for (let i = 0; i < input.length; i++) {
			if (validate(input[i]) == false) {
				showValidate(input[i]);
				check = false;
			}
		}

		event.preventDefault();
		if (check) {
			let data;
			let url;
			const password = $('input[name=pass]').val().trim();
			const email = $('input[name=email]').val().trim();
			if (input.length == 2) {
				url = '/login';
				data = {
					password,
					email,
				};
			} else {
				url = '/register';
				const username = $('input[name=user]').val().trim();
				data = {
					password,
					email,
					username,
				};
			}
			$.post(url, data, 'json').done((res) => {
				alert(`welcome ${data.email}`);
				location.href = '/';
			}).fail((res) => {
				if (url === '/login') {
					alert('wrong password try again !');
				} else {
					alert(`${email}: exists try another email !`);
				}
			});
		}
		return check;
	});

	$('.validate-form .input100').each(function () {
		$(this).focus(function () {
			hideValidate(this);
		});
	});

	function validate(input) {
		if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
			if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
				return false;
			}
		} else if ($(input).val().trim() == '') {
			return false;
		}
	}

	function showValidate(input) {
		const thisAlert = $(input).parent();
		const password = $('input[name=pass]').val().trim();
		const email = $('input[name=email]').val().trim();
		console.log(password, email);
		$(thisAlert).addClass('alert-validate');
	}

	function hideValidate(input) {
		const thisAlert = $(input).parent();

		$(thisAlert).removeClass('alert-validate');
	}
}(jQuery));
