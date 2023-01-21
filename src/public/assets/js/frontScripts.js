$(document).ready(function () {
	$('.sidenav').sidenav();
	$('.tabs').tabs();
	$('.dropdown-trigger').dropdown();
	$('select').formSelect();
});

const toCurrency = (price) => {
	return new Intl.NumberFormat('ru-RU', {
		currency: 'rub',
		style: 'currency',
	}).format(price);
};

const toDate = (date) => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(new Date(date));
};

document.querySelectorAll('.date').forEach((node) => {
	node.textContent = toDate(node.textContent);
});

document.querySelectorAll('.price_game').forEach((node) => {
	node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
	$cart.addEventListener('click', (e) => {
		if (e.target.classList.contains('cart-delete')) {
			const id = e.target.dataset.id;
			const csrf = e.target.dataset.csrf;

			fetch('/cart/delete/' + id, {
				method: 'delete',
				headers: { 'X-XSRF-TOKEN': csrf },
			})
				.then((res) => res.json())
				.then((cart) => {
					if (cart.gameModel.length) {
						const cartHTML = cart.gameModel
							.map((c) => {
								return `
							<tr>
								<td>${c.title}</td>
								<td>${c.count}</td>
								<td>${c.price}</td>
								<td>${c.allPrice}</td>
								<td><button class='btn red cart-delete' data-id='${c.id}'>Delete</button></td>
							</tr>
							`;
							})
							.join('');
						$cart.querySelector('tbody').innerHTML = cartHTML;
						$cart.querySelector('.price_game').textContent = toCurrency(cart.price);
					} else {
						$cart.innerHTML = `		<h1> Cart is EMPTY</h1>
						<h2> Let to <a href='/list'>shop</a></h2>`;
					}
				});
		}
	});
}
